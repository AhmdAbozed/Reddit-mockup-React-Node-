import { body, validationResult } from 'express-validator';
import express, { Router } from "express"
import e, { Request, Response } from 'express'
import { usersStore, user } from '../models/users.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
//import {verifyAuthToken, redirectToHome, createToken} from "../util/tokenauth.js"
import bodyParser from "body-parser";
import path from "path"

dotenv.config()

const { tokenSecret, adminTokenSecret, adminUsername, adminPassword, HOST_PORT_URL} = process.env

//const urlencodedParser = bodyParser.urlencoded({ extended: false })

const store = new usersStore();

//See express-validator docs for, docs.
const signUpPost = [

    body('Username')
        .matches(/^\w{4,20}$/).withMessage("Username must be 4-20 characters"),

    body('Email').isEmail().withMessage("Email invalid"),

    body('Password').matches(/^\w{4,20}$/).withMessage("Password must be 4-20 characters"),

    async function (req: Request, res: Response) {

        const errorArr = validationResult(req).array()

        if (errorArr[0]) {
            //An error is found
            let errorPrompt = "";
            for (const error of errorArr) {
                errorPrompt += error.msg + "\n";
            }
            res.status(403).send(JSON.stringify(errorPrompt));
            console.log("ErrorArr: " + JSON.stringify(errorArr))
            console.log("express-vali validationResult(req) "+validationResult(req))
            return;
        }

        const submission: user = {username: req.body.Username, password: req.body.Password, email: req.body.Email  }
        console.log("submission thing: " + JSON.stringify(submission))
        const validation = await store.validateSignUp(submission)
        if (validation[0]){
            //username/email already exist
            console.log("recieved validation: "+JSON.stringify(validation[0]))
            let errorPrompt = "";
            for (const error of validation) {
                errorPrompt += error.msg + "\n";
            }
            res.status(403).send(JSON.stringify(errorPrompt));
            console.log("ErrorPrompt signup: " + JSON.stringify(errorPrompt))
            return;
          
        }
        const result = await store.signup(submission)

        //createToken(res, result)
        
        res.status(200).send(errorArr)

        console.log("result/End Of Sign Up Function: "+result)
    }]

    const signInPost = [

        body('Username')
            .matches(/^\w{4,20}$/).withMessage("Username must be 4-20 characters"),
    
        body('Password').matches(/^\w{4,20}$/).withMessage("Password must be 4-20 characters"),
    
        async function (req: Request, res: Response) {
    
            const errorArr = validationResult(req).array()
    
            if (errorArr[0]) {
              //An error is found
              let errorPrompt = "";
              for (const error of errorArr) {
                  errorPrompt += error.msg + "\n";
              }
              res.status(403).send(errorPrompt);
              console.log("ErrorArr: " + JSON.stringify(errorArr))
              console.log("express-vali validationResult(req) "+validationResult(req))
              return;
            }
            
            const submission: user = {username: req.body.Username, password: req.body.Password, email: req.body.Email  }
            console.log("submission login thing: " + JSON.stringify(submission))

            const result = await store.signin(submission)
    
            //createToken(res, result)
            if(result[0]){
                res.status(200).send(result)
            }
            else{
                res.status(403).send("Incorrect username or password")
            }
            
            console.log("result/End Of Sign In Function: "+result)
        }]
    

    const UsersRouter = Router()
    UsersRouter.post("/users/signup", signUpPost);
    
    UsersRouter.post("/users/signin", signInPost);
    //PostsRouter.post("/posts", postPosts)
    
    export default UsersRouter; 
    