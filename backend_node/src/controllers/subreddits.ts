import { Request, Response } from 'express'
import { subredditsStore, subreddit } from '../models/subreddits.js';
import dotenv from 'dotenv'
import Router from 'express'
import { tokenClass } from '../util/tokenauth.js';
import { BaseError } from '../util/errorHandler.js';

const tokenFuncs = new tokenClass()

const SubredditsRouter = Router();

dotenv.config()

//let psuedoPost: post = {op: "NULL", title: "NULL", text: "NULL", img: "NULL", votes: 0}

const { adminTokenSecret, blazeKeyId, blazeKey, HOST_PORT_URL } = process.env

const store = new subredditsStore();

const getSubreddits = async function (req: Request, res: Response) {

    const result = await store.index();
    console.log(result[0])
    res.status(200).send(result);

}
const postSubreddit = async function (req: Request, res: Response, next: any) {
    try {
        const payload = JSON.parse(Buffer.from(req.cookies.refreshToken.split('.')[1], 'base64').toString())

        if ((req.body.Type != "public" && req.body.Type != "private" && req.body.Type != "restricted")) {
            throw new BaseError(400, "Subreddit Creation Error: Invalid subreddit type")
        }

        const subreddit: subreddit = {
            title: req.body.Title,
            owner_id: Number(payload.user_id),
            type: req.body.Type,
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

SubredditsRouter.get("/subreddits", getSubreddits);
SubredditsRouter.post("/subreddits", tokenFuncs.verifyAccessToken.bind(tokenFuncs), postSubreddit);

export default SubredditsRouter; 
