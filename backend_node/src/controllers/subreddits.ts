import { Request, Response } from 'express'
import { subredditsStore, subreddit } from '../models/subreddits.js';
import dotenv from 'dotenv'
import Router from 'express'

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

/*
const postPosts = async function (req: Request, res: Response) {
    try{
        console.log("the body " + req.body.Text);
        
        psuedoPost.text = req.body.Text;
        psuedoPost.title = req.body.Title;        

        const result = await store.create(psuedoPost);
        console.log("posting post result: " + result)
        if(result)res.sendStatus(200);
    }
    catch(err) {
            console.log("Error parsing the files: " + err);
        }
    }
*/
SubredditsRouter.get("/subreddits", getSubreddits);
//PostsRouter.post("/posts", postPosts)

export default SubredditsRouter; 
