import { Request, Response } from 'express'
import { subredditsStore, subreddit } from '../models/subreddits.js';
import dotenv from 'dotenv'
import Router from 'express'
import { tokenClass } from '../util/tokenauth.js';
import { BaseError } from '../util/errorHandler.js';

const tokenFuncs = new tokenClass()

const SubredditsRouter = Router();

dotenv.config()

const store = new subredditsStore();

const index = async function (req: Request, res: Response) {

    const result = await store.index();
    console.log(result[0])
    res.status(200).send(result);

}
const getSubreddit = async function (req: Request, res: Response, next: any) {
    try{
        console.log("params id of subreddit get: "+req.params.id)
        if(!Number(req.params.id)){
            throw new BaseError(400, "Failed to fetch subreddit, invalid/missing subreddit URL id")
        }
        const result = await store.read(Number(req.params.id));
        if(result){
            res.status(200).send(result);    
        }else res.status(404).send(JSON.stringify("Subreddit not found"))
    }
    catch(err){
        next(err)
    }
}

const postSubreddit = async function (req: Request, res: Response, next: any) {
    try {
        const payload = JSON.parse(Buffer.from(req.cookies.refreshToken.split('.')[1], 'base64').toString())

        if ((req.body.Type != "public" && req.body.Type != "private" && req.body.Type != "restricted")) {
            throw new BaseError(400, "Subreddit Creation Error: Invalid subreddit type")
        }
        if(!Number(payload.user_id)){
            throw new BaseError(400, "Subreddit Creation Error: Invalid user id")
        }

        const subreddit: subreddit = {
            title: req.body.Title,
            owner_id: Number(payload.user_id),
            type: req.body.Type,
            creation_date: new Date().toLocaleDateString()
        }

        console.log("posting subreddit input: " + JSON.stringify(subreddit))

        const result = await store.create(subreddit);
        console.log("posting subreddit result: " + JSON.stringify(result))
        if (result) res.sendStatus(200);
        else throw new BaseError(403, "Subreddit creation failed.")
    }
    catch (err) {
        next(err)
    }
}

SubredditsRouter.get("/subreddits", index);
SubredditsRouter.get("/subreddits/:id", getSubreddit);
SubredditsRouter.post("/subreddits", tokenFuncs.verifyAccessToken.bind(tokenFuncs), postSubreddit);

export default SubredditsRouter; 
