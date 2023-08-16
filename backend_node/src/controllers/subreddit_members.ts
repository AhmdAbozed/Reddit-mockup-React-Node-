import { Request, Response } from 'express'
import { subredditMembersStore, subreddit_member } from '../models/subreddit_members.js';
import dotenv from 'dotenv'
import Router from 'express'
import { BaseError } from '../util/errorHandler.js';

const SubredditMembersRouter = Router();

dotenv.config()

const store = new subredditMembersStore();

const getSubredditMember = async function (req: Request, res: Response, next:any) {
    try{
        if(!(Number(req.query.subreddit_id) && Number(req.query.member_id))){
            throw new BaseError(400, "subreddit member GET: Invalid subreddit or member id (NaN)");
        }
        const newMember: subreddit_member = {subreddit_id: Number(req.query.subreddit_id), member_id: Number(req.query.member_id)}
        const result = await store.getSubredditMember(newMember);
        if(result && result.id) res.status(200).send(result);
        else res.sendStatus(404)
    }
    catch(err){
        next(err)
    }

}

const addSubredditMember = async function (req: Request, res: Response, next:any) {
    try{
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
            throw new BaseError(500, "Failed to add member")
        }
    }
    catch(err){
        next(err)
    }

}


SubredditMembersRouter.get("/members", getSubredditMember);;
SubredditMembersRouter.post("/members", addSubredditMember);;
export default SubredditMembersRouter; 

