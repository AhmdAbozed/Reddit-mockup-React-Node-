import { Request, Response } from 'express'
import { postsStore, post } from '../models/posts.js';
import dotenv from 'dotenv'
import Router from 'express'
import { tokenClass } from '../util/tokenauth.js';



dotenv.config()


const { adminTokenSecret, blazeKeyId, blazeKey, HOST_PORT_URL } = process.env

const PostsRouter = Router(); 

const tokenFuncs = new tokenClass()

let psuedoPost: post = {op_id: -1, title: "NULL", text: "NULL", img: "NULL", votes: 0, subreddit_id: "0"}

const store = new postsStore();

const getPosts = async function (req: Request, res: Response) {
    
    const result = await store.subredditPosts(req.params.id)
    console.log(result[0])
    res.send(result);

}

const postPosts = async function (req: Request, res: Response) {
    try{
        console.log("post controller: the Desc " + req.body.Text);
        console.log("post controller: the Title " + req.body.Title);
        const payload = JSON.parse(Buffer.from(req.cookies.refreshToken.split('.')[1],'base64').toString() )
        console.log("payload"+payload)
        psuedoPost.text = req.body.Text;
        psuedoPost.title = req.body.Title;        
        psuedoPost.subreddit_id = req.params.id;
        psuedoPost.op_id = Number(payload.user_id)
        const result = await store.create(psuedoPost);
        console.log("posting post result: " + JSON.stringify(result))
        if(result)res.sendStatus(200);
        else res.sendStatus(403)
    }
    catch(err) {
            console.log("Error parsing the files: " + err);
        }

    }

PostsRouter.get("/subreddits/:id/posts", getPosts);
//.bind() binds 'this' inside verifyAT to tokenFuncs object
PostsRouter.post("/subreddits/:id/posts",tokenFuncs.verifyAccessToken.bind(tokenFuncs), postPosts)

export default PostsRouter; 
