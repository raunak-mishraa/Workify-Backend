import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

//configure
// console.log(process.env.CLIENT_URL)
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
import gigRouter from './routes/gig.routes.js'
import reviewRouter from './routes/review.routes.js'
import orderRouter from './routes/order.routes.js'
import conversationRouter from './routes/coversation.routes.js'
import projectRouter from './routes/project.routes.js'
app.use("/api/v1/users", userRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/applications', applicationRouter)
app.use('/api/v1/search', searchRouter)
app.use('/api/v1/gigs', gigRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/conversations', conversationRouter)
app.use('/api/v1/project', projectRouter)

export { app }