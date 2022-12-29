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


dotenv.config()

const { tokenSecret, adminTokenSecret } = process.env;
class tokenClass {
  //If permission = "admin", admin token is added to response along with user token.
  createAccessToken(req: Request, res: Response, next?: any) {
    try {
      console.log("inside createaccess")
      const options = {
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
        secure: false, //http or https, will change later
        httpOnly: true, //To prevent client-side access to cookies
      }


      const token = jwt.sign({ data: "ayy" }, tokenSecret as string)

      res.cookie('accessToken', token, options);
      res.cookie('accessTokenExists', "", {
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
        secure: false, //http or https, will change later
        httpOnly: false, //To prevent client-side access to cookies
      });
      if(next){
        console.log("next found inside createaccesstoken")
        next();
        return;
      }
      res.status(200).send(JSON.stringify("access and refresh created"))
    }
    catch (error) {
      res.status(403).send(JSON.stringify("Error creating access token: .") + error)
    }
  }
  async createRefreshToken(req: Request, res: Response, user_id: number, permission?: string): Promise<any> {
    try {
      console.log("inside createrefresh")
      const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 1000), // 7 days
        secure: false, //http or https, will change later
        httpOnly: true, //To prevent client-side access to cookies
      }

      const token = jwt.sign({ user_id: user_id }, tokenSecret as string)
      const conn = await client.connect();
      const sql = 'INSERT INTO refreshtokens (user_id, token) VALUES ($1, $2) RETURNING *';
      const results = await conn.query(sql, [user_id, token]);
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
    catch (error) {
      res.status(403).send(JSON.stringify("Error creating refresh token: ." + error))
    }
  }

  
  verifyAccessToken(req: Request, res: Response, next: any){
    console.log("inside verifyaccess")
      const __dirname = path.resolve();

      try {
        if (req.cookies.accessToken) {
          console.log("Accesstoken exists, verifying..")
          const token: string = req.cookies.accessToken;
          const decoded = jwt.verify(token, tokenSecret as Secret)
          next()
        }
        else { //no access token, verify that refresh exists to create new access token
          console.log("Accesstoken doesnt exist")
          this.verifyRefreshToken(req, res, next);
        }
      }
      catch (error) {
        console.log("verify access error: "+error)
        res.status(403).send(JSON.stringify("Invalid Authentication Token. [access Token]"))
      }
    }
  



  async verifyRefreshToken(req: Request, res: Response, next: any) {
    console.log("inside verifyrefresh")
    const __dirname = path.resolve();

    try {

      if (req.cookies.refreshToken) {
        const token: string = req.cookies.refreshToken;
        const decoded = jwt.verify(token, tokenSecret as Secret)
        const conn = await client.connect();
        const sql = 'SELECT FROM refreshtokens wHERE token=($1)';
        const results = await conn.query(sql, [token]);
        conn.release();
        console.log("result of refresh query: " + results.rows)
        if (results.rows[0]) {
          this.createAccessToken(req, res, next)
        }
        else {//refreshtoken doesnt exist in db
          res.status(404).send(JSON.stringify("No refresh token, redirect to login"))//idk if this is the correct error code
        }

      }
      else {
        res.status(401).send(JSON.stringify("refresh token expired."))
      }
    }
    catch (error) {
      console.log(error)
      res.status(403).send(JSON.stringify("Invalid refresh token."))
    }
  }
}

export {
  tokenClass
};