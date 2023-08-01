import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import PostsRouter from './controllers/posts.js'
import SubredditsRouter from './controllers/subreddits.js'
import usersRouter from './controllers/users.js'
import SubredditMembersRouter from './controllers/subreddit_members.js'
import cookieParser from 'cookie-parser'
import { BaseError, sendError } from './util/errorHandler.js'
import blazeApi from './util/backblaze.js'
import commentsRouter from './controllers/comments.js'
dotenv.config()

const port = process.env.backendPort 
const app = express()
const address: string = "http://localhost:3003"

const corsOptions = {
    optionsSuccessStatus: 200
}

app.use(bodyParser.urlencoded({ extended: true, limit:"10mb" }));
app.use(bodyParser.json({limit:"10mb"}));

app.use(cors({
    "allowedHeaders": [
      'Origin', 'X-Requested-With',
      'Content-Type', 'Accept',
      'X-Access-Token', 'Authorization', 'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Credentials'
    ],
    "methods": 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    "preflightContinue": false,
    "origin": 'http://localhost:3000',
    "credentials": true //necessary for cookies
}));

app.use(cookieParser())

app.listen(port, function () {
    console.log(`starting app on: ${address}`)
})

app.use('/', PostsRouter)
app.use('/', SubredditsRouter)
app.use('/', usersRouter)
app.use('/',SubredditMembersRouter)
app.use('/', commentsRouter)
app.use(sendError)



export {app}