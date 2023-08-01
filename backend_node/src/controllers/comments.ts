import { Request, Response } from 'express'
import { commentsStore, comment } from '../models/comments.js';
import dotenv from 'dotenv'
import Router from 'express'
import { tokenClass } from '../util/tokenauth.js';
import { BaseError } from '../util/errorHandler.js';
import multer from 'multer'
import blazeApi from '../util/backblaze.js';
dotenv.config()

const { adminTokenSecret, blazeKeyId, blazeKey, HOST_PORT_URL } = process.env

const upload = multer({ dest: 'uploads/' })

const commentsRouter = Router();

const tokenFuncs = new tokenClass()

let psuedoComment: comment = { user_id: -1,  text: "NULL", votes: 0, post_id: -1, parent_id: null }

const store = new commentsStore();

const getComments = async function (req: Request, res: Response, next: any) {
    try {
        if (!Number(req.params.id)) {
            throw new BaseError(400, "Failed to fetch comments, invalid/missing post id at url")
        }
        const result = await store.getComments(Number(req.params.post_id))
        res.send(result);
    }
    catch (err) {
        next(err)
    }
}

const postComment = async function (req: Request, res: Response, next: any) {

    //console.log("comment controller: the Text " + req.body.Text);
    let payloadUserId;
    try {
        const payload = JSON.parse(Buffer.from(req.cookies.refreshToken.split('.')[1], 'base64').toString())
        payloadUserId = Number(payload.user_id)
    } catch {
        //something's wrong with the refreshtoken.
        next(new BaseError(403, "Invalid refresh token"))
        return;
    }
    console.log("comment post req body: "+JSON.stringify(req.body))
    console.log("comment post parent id"+req.body.parent_id)
    
    psuedoComment.text = req.body.Text;
    psuedoComment.parent_id = req.body.parent_id
    psuedoComment.post_id = Number(req.params.post_id);
    psuedoComment.user_id = payloadUserId;
    const result = await store.postComment(psuedoComment);
    console.log("posting post result: " + JSON.stringify(result))

    try {
        if (result && result.id) {
            res.sendStatus(200);
        }
        else throw new BaseError(403, "Comment creation failed.")
    }
    catch (err) {
        next(err)
    }
}

const vote = async (req: Request, res: Response, next: any) => {
    try {
        if (!(Number(req.params.post_id) && Number(req.query.user_id)&& Number(req.query.comment_id) && Number.isInteger(Number(req.query.vote)) && Number.isInteger(Number(req.query.comment_id)))) {
            throw new BaseError(400, "Failed to vote comment, invalid/missing url parameters")
        }
        if (Number(req.query.vote) == 0) {
            //vote changed to 0 ie unvoted, delete it from db and update vote count accordingly
            const result = await store.deleteVote(Number(req.query.comment_id), Number(req.query.user_id), Number(req.query.vote))
            res.send(result);
        } else {
            const result = await store.submitVote(Number(req.query.comment_id), Number(req.query.user_id), Number(req.params.post_id), Number(req.query.vote))
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
        const result = await store.userVotes(Number(req.params.post_id), Number(req.query.user_id))
        res.send(result);
    }
    catch (err) {
        next(err)
    }
}

commentsRouter.get("/subreddits/:id/posts/:post_id/comments/votes", getVotes)
commentsRouter.post("/subreddits/:id/posts/:post_id/comments/vote", vote)
commentsRouter.get("/subreddits/:id/posts/:post_id/comments", getComments);
//.bind() binds 'this' inside verifyAT to tokenFuncs object
commentsRouter.post("/subreddits/:id/posts/:post_id", tokenFuncs.verifyAccessToken.bind(tokenFuncs), postComment)

export default commentsRouter; 
