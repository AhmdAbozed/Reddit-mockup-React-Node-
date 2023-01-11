/*
  Cookies are httponly for security but frontend needs to know if they exist for access control
  so similar but empty cookies are sent at the same time
  May cause trouble later with manually expiring tokens
*/
import { Request, Response } from 'express'
import dotenv from 'dotenv'
import jwt, { Secret } from 'jsonwebtoken'
import path from "path"
import client from '../database.js'
import { user } from '../models/users.js'
import { BaseError, sendError } from './errorHandler.js'

dotenv.config()

const { tokenSecret, adminTokenSecret } = process.env;
class tokenClass {

  createAccessToken(req: Request, res: Response, next?: any) {

    console.log("inside createaccess")
    const options = {
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      secure: false, //http or https, will change later
      httpOnly: true, //To prevent client-side access to cookies
    }


    const token = jwt.sign({ data: "ayy" }, tokenSecret as string)

    res.cookie('accessToken', token, options);

    //empty cookie to tell the frontend the httponly cookies exist 
    res.cookie('accessTokenExists', "", {
      expires: new Date(Date.now() + 10 * 60 * 1000),
      secure: false,
      httpOnly: false,
    });
    if (next) {
      //function is either called independently or part of middleware, then it has a next
      console.log("next found inside createaccesstoken")
      next();
      return;
    }
    res.status(200).send(JSON.stringify("access and refresh created"))
  }

  async createRefreshToken(req: Request, res: Response, user: user, permission?: string): Promise<any> {
    console.log("inside createrefresh")
    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 1000), // 7 days
      secure: false, //http or https, will change later
      httpOnly: true, //To prevent client-side access to cookies
    }

    const token = jwt.sign({ user: user.username, user_id: user.id }, tokenSecret as string)
    const conn = await client.connect();
    const sql = 'INSERT INTO refreshtokens (user_id, token) VALUES ($1, $2) RETURNING *';
    const results = await conn.query(sql, [user.id, token]);
    conn.release();

    console.log("about to send cookies [refresh]")

    res.cookie('refreshToken', token, options);
    res.cookie('refreshTokenExists', "", {
      expires: new Date(Date.now() + 7 * 24 * 60 * 1000), // 7 days
      secure: false, //http or https, will change later
      httpOnly: false, //To prevent client-side access to cookies
    })

    console.log("sent all cookies [refresh]")
    this.createAccessToken(req, res);
    return;
  }


  verifyAccessToken(req: Request, res: Response, next: any) {
    console.log("inside verifyaccess")
    if(!req.cookies.refreshToken){
      //no refresh token, let refreshfunction handle it
      this.verifyRefreshToken(req, res, next);
    }
    if (req.cookies.accessToken) {
      console.log("Accesstoken exists, verifying..")
      const token: string = req.cookies.accessToken;
      try {
        jwt.verify(token, tokenSecret as Secret, (err) => { if (err){throw new Error()}})

        console.log("MADE IT NEXT TO NEXT")
        next()
      }
      catch (error) {
        //accesstoken has been tampered with, create new one
        this.verifyRefreshToken(req, res, next);
      }
    }
    else { //no access token, verify that refresh exists to create new access token
      console.log("Accesstoken doesnt exist")
      this.verifyRefreshToken(req, res, next);
    }


  }




  async verifyRefreshToken(req: Request, res: Response, next: any) {
    console.log("inside verifyrefresh")
    const __dirname = path.resolve();

    try {

      if (req.cookies.refreshToken) {
        const token: string = req.cookies.refreshToken;
        jwt.verify(token, tokenSecret as Secret, function (err) {
          if (err) {
            console.log(JSON.stringify(err))
            throw new BaseError(403, err.message)
          }
        })
        const conn = await client.connect();
        const sql = 'SELECT FROM refreshtokens wHERE token=($1)';
        const results = await conn.query(sql, [token]);
        conn.release();
        console.log("result of refresh query: " + results.rows)
        if (results.rows[0]) {
          this.createAccessToken(req, res, next)
        }
        else {//refreshtoken doesnt exist in db
          throw new BaseError(404, "refresh token not found, redirect to login")
        }

      }
      else {
        throw new BaseError(401, "refresh token missing/expired.")
      }
    }
    catch (error) {
      console.log("CAUGHT ERROR IN REFRESH: " + JSON.stringify(error))
      next(error)
    }
  }
}

export {
  tokenClass
};