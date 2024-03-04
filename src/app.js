import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

//configure
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json('limit', '10kb'));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static('public'));
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import applicationRouter from './routes/application.routes.js';
import searchRouter from './routes/search.routes.js'
app.use("/api/v1/users", userRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/applications', applicationRouter)
app.use('/api/v1/search', searchRouter)
export { app }