import { Request, Response } from 'express'
import { postsStore, post } from '../models/posts.js';
import dotenv from 'dotenv'
import Router from 'express'

const PostsRouter = Router(); 

dotenv.config()

let psuedoPost: post = {op: "NULL", title: "NULL", text: "NULL", img: "NULL", votes: 0, subreddit_id: "0"}

const { adminTokenSecret, blazeKeyId, blazeKey, HOST_PORT_URL } = process.env

const store = new postsStore();

const getPosts = async function (req: Request, res: Response) {
    
    const result = await store.subredditPosts(req.params.id)
    console.log(result[0])
    res.send(result);

}

const postPosts = async function (req: Request, res: Response) {
    try{
        console.log("the Desc " + req.body.Text);
        console.log("the Title " + req.body.Title);
        
        psuedoPost.text = req.body.Text;
        psuedoPost.title = req.body.Title;        
        psuedoPost.subreddit_id = req.params.id;
        const result = await store.create(psuedoPost);
        console.log("posting post result: " + JSON.stringify(result))
        if(result)res.sendStatus(200);
    }
    catch(err) {
            console.log("Error parsing the files: " + err);
        }

    }

PostsRouter.get("/subreddits/:id/posts", getPosts);
PostsRouter.post("/subreddits/:id/posts", postPosts)

export default PostsRouter; 
