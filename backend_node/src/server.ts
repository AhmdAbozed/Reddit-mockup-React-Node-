import express from 'express'
import { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import PostsRouter from './controllers/posts.js'
import SubredditsRouter from './controllers/subreddits.js'
dotenv.config()

const port = process.env.backendPort 
const app = express()
const address: string = "http://localhost:3003"

const corsOptions = {
    optionsSuccessStatus: 200
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
    "allowedHeaders": [
      'Origin', 'X-Requested-With',
      'Content-Type', 'Accept',
      'X-Access-Token', 'Authorization', 'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods'
    ],
    "methods": 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    "preflightContinue": true,
    "origin": 'http://localhost:3000',
}));

//app.options('/*', (_, res) => {res.sendStatus(200);});

app.listen(port, function () {
    console.log(`starting app on: ${address}`)
})

app.use('/', PostsRouter)
app.use('/', SubredditsRouter)

export {app}