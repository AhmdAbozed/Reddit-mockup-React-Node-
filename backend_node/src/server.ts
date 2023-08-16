import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import PostsRouter from './controllers/posts.js'
import SubredditsRouter from './controllers/subreddits.js'
import usersRouter from './controllers/users.js'
import SubredditMembersRouter from './controllers/subreddit_members.js'
import cookieParser from 'cookie-parser'
import { sendError } from './util/errorHandler.js'
import commentsRouter from './controllers/comments.js'

//GC App Engine env variable
const port = parseInt(process.env.backendPort!) || 8080;
const app = express()
const corsOptions = {
    optionsSuccessStatus: 200
}

app.use(bodyParser.urlencoded({ extended: true, limit:"30mb" }));
app.use(bodyParser.json({limit:"30mb"}));

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
    "credentials": true //necessary for cookies
}));


app.get('/', (req, res) => {
    res.send('Server Up and Running');
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});


app.use(cookieParser())
app.use('/', PostsRouter)
app.use('/', SubredditsRouter)
app.use('/', usersRouter)
app.use('/',SubredditMembersRouter)
app.use('/', commentsRouter)
app.use(sendError)

export { app }