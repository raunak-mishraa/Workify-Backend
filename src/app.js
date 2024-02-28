import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

//configure
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json('limit', '10kb'));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static('public'));
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js';

app.use("/api/v1/users", userRouter)

export { app }