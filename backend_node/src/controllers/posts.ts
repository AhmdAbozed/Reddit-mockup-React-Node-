import { Request, Response } from 'express'
import { postsStore, post } from '../models/posts.js';
import dotenv from 'dotenv'
import Router from 'express'
import { tokenClass } from '../util/tokenauth.js';
import { BaseError } from '../util/errorHandler.js';
import multer from 'multer'
import blazeApi from '../util/backblaze.js';
dotenv.config()

const { adminTokenSecret, blazeKeyId, blazeKey, HOST_PORT_URL } = process.env

const upload = multer({ dest: 'uploads/' })

const PostsRouter = Router();

const tokenFuncs = new tokenClass()

let psuedoPost: post = { op_id: -1, title: "NULL", text: "NULL", img: "NULL", votes: 0, subreddit_id: "0" }

const store = new postsStore();

const getPosts = async function (req: Request, res: Response, next: any) {
    try {
        if (!Number(req.params.id)) {
            throw new BaseError(400, "Failed to fetch post, invalid/missing subreddit id at url")
        }
        const result = await store.subredditPosts(Number(req.params.id))
        res.send(result);
    }
    catch (err) {
        next(err)
    }
}

const postPosts = async function (req: Request, res: Response, next: any) {

    console.log("post controller: the Desc " + req.body.Text);
    console.log("post controller: the Title " + req.body.Title);
    let payloadOpId;
    try {
        const payload = JSON.parse(Buffer.from(req.cookies.refreshToken.split('.')[1], 'base64').toString())
        payloadOpId = Number(payload.user_id)
    } catch {
        //something's wrong with the refreshtoken.
        next(new BaseError(403, "Invalid refresh token"))
        return;
    }
    console.log(req.body)
    
    psuedoPost.text = req.body.Text;
    psuedoPost.title = req.body.Title;
    psuedoPost.subreddit_id = req.params.id;
    psuedoPost.op_id = payloadOpId;
    const result = await store.create(psuedoPost);
    console.log("posting post result: " + JSON.stringify(result))

    try {
        console.log(req.file)
        if (result && result.id && req.file) {
            const blaze = new blazeApi()
            const imgUpload = await blaze.uploadImg(req.file!.path, req.file!.size, `${result.id}`)
            console.log("img upload result")
            res.sendStatus(200);
        }
        else if(result && result.id) res.sendStatus(200)
        else throw new BaseError(403, "Post creation failed.")
    }
    catch (err) {
        next(err)
    }
}

const vote = async (req: Request, res: Response, next: any) => {
    try {
        if (!(Number(req.params.post_id) && Number(req.query.user_id) && Number.isInteger(Number(req.query.vote)))) {
            throw new BaseError(400, "Failed to vote post, invalid/missing url parameters")
        }
        if (Number(req.query.vote) == 0) {
            //vote changed to 0 ie unvoted, delete it from db and update vote count accordingly
            const result = await store.deleteVote(Number(req.params.post_id), Number(req.query.user_id), Number(req.params.id), Number(req.query.vote))
            res.send(result);
        } else {
            const result = await store.submitVote(Number(req.params.post_id), Number(req.query.user_id), Number(req.params.id), Number(req.query.vote))
            res.send(result);
        }
    }
    catch (err) {
        next(err)
    }
}

const getVotes = async (req: Request, res: Response, next: any) => {
    try {
        console.log("Getting votes: " + req.params.id + " " + req.query.user_id)
        if (!(Number(req.params.id) && Number(req.query.user_id))) {
            throw new BaseError(400, "Failed to get votes, invalid/missing url parameters")
        }
        const result = await store.userVotes(Number(req.params.id), Number(req.query.user_id))
        res.send(result);
    }
    catch (err) {
        next(err)
    }
}

PostsRouter.get("/subreddits/:id/posts/votes", getVotes)
PostsRouter.post("/subreddits/:id/posts/:post_id/vote", vote)
PostsRouter.get("/subreddits/:id/posts", getPosts);
//.bind() binds 'this' inside verifyAT to tokenFuncs object
PostsRouter.post("/subreddits/:id/posts", tokenFuncs.verifyAccessToken.bind(tokenFuncs), upload.single('Img'), postPosts)

export default PostsRouter; 
