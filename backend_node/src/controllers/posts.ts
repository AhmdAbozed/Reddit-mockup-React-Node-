import { Request, Response } from 'express'
import { postsStore, post } from '../models/posts.js';
import dotenv from 'dotenv'
import Router from 'express'
import { tokenClass } from '../util/tokenauth.js';
import { BaseError } from '../util/errorHandler.js';
import { nextTick } from 'process';


dotenv.config()


const { adminTokenSecret, blazeKeyId, blazeKey, HOST_PORT_URL } = process.env

const PostsRouter = Router(); 

const tokenFuncs = new tokenClass()

let psuedoPost: post = {op_id: -1, title: "NULL", text: "NULL", img: "NULL", votes: 0, subreddit_id: "0"}

const store = new postsStore();

const getPosts = async function (req: Request, res: Response, next: any) {
    try{
        if(!Number(req.params.id)){
            throw new BaseError(400, "Failed to fetch post, invalid/missing subreddit id at url")
        }
        const result = await store.subredditPosts(req.params.id)

        res.send(result);
    }
    catch(err){
        next(err)
    }
}

const postPosts = async function (req: Request, res: Response, next: any) {
    
        console.log("post controller: the Desc " + req.body.Text);
        console.log("post controller: the Title " + req.body.Title);
        let payload;
        try {
            payload = JSON.parse(Buffer.from(req.cookies.refreshToken.split('.')[1],'base64').toString() )
        }catch{
            //something's wrong with the refreshtoken.
            next(new BaseError(403, "Invalid refresh token"))
            return;
        }
        console.log("payload"+payload)
        psuedoPost.text = req.body.Text;
        psuedoPost.title = req.body.Title;        
        psuedoPost.subreddit_id = req.params.id;
        psuedoPost.op_id = Number(payload.user_id)
        const result = await store.create(psuedoPost);
        console.log("posting post result: " + JSON.stringify(result))
        
        try{
            if(result)res.sendStatus(200);
            else throw new BaseError(403, "Post creation failed.")
        }
        catch(err){
            next(err)
        }
        

    }

PostsRouter.get("/subreddits/:id/posts", getPosts);
//.bind() binds 'this' inside verifyAT to tokenFuncs object
PostsRouter.post("/subreddits/:id/posts",tokenFuncs.verifyAccessToken.bind(tokenFuncs), postPosts)

export default PostsRouter; 
