import dotenv from 'dotenv';

import ConnectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({
    path: './.env'
});
console.log(process.env.CLIENT_URL);
console.log(process.env.PORT);
ConnectDB()
.then(() =>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((e) => console.log("MongoDB connection failed", e.message));