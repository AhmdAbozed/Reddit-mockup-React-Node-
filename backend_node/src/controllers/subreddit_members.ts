import { Request, Response } from 'express'
import { subredditMembersStore, subreddit_member } from '../models/subreddit_members.js';
import dotenv from 'dotenv'
import Router from 'express'
import { tokenClass } from '../util/tokenauth.js';
import { BaseError } from '../util/errorHandler.js';
import { get } from 'https';

const tokenFuncs = new tokenClass()

const SubredditMembersRouter = Router();

dotenv.config()

//let psuedoPost: post = {op: "NULL", title: "NULL", text: "NULL", img: "NULL", votes: 0}


const store = new subredditMembersStore();

const getSubredditMember = async function (req: Request, res: Response, next:any) {
    try{
        console.log("id of subreddit submember get: "+req.params.subreddit_id)
        if(!(Number(req.query.subreddit_id) && Number(req.query.member_id))){
            throw new BaseError(400, "subreddit member GET: Invalid subreddit or member id (NaN)");
        }
        const newMember: subreddit_member = {subreddit_id: Number(req.query.subreddit_id), member_id: Number(req.query.member_id)}
        const result = await store.getSubredditMember(newMember);
        console.log(result)
        if(result) res.status(200).send(result);
        else res.sendStatus(404)
    }
    catch(err){
        next(err)
    }

}

const addSubredditMember = async function (req: Request, res: Response, next:any) {
    try{
        console.log("subreddit submember POST: "+JSON.stringify(req.query))
        if(!(Number(req.query.subreddit_id) && Number(req.query.member_id))){
            throw new BaseError(400, "subreddit member POST: Invalid subreddit or member id (NaN)")
        }
        const newMember: subreddit_member = {subreddit_id: Number(req.query.subreddit_id), member_id: Number(req.query.member_id)}
        const result = await store.addMember(newMember);
        if(result){
            console.log("Member added to sub.")
            res.status(200).send(JSON.stringify("Member added successfully"))
            return;
        }
        else{
            throw new BaseError(500, "Unidentified Server Error: Failed to add member")
        }
    }
    catch(err){
        next(err)
    }

}


SubredditMembersRouter.get("/members", getSubredditMember);;
SubredditMembersRouter.post("/members", addSubredditMember);;
export default SubredditMembersRouter; 

