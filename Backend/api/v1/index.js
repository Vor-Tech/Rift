import express from "express";
import mongoose from "mongoose";
import cors  from "cors";

import {default as env} from 'dotenv';

env.config();
//express

const app = express();
app.use(express.json());
app.use(cors());

const PORT = env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//mongoose

const uri = env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017';
mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if(err) throw err;
    console.log("MongoDB Connected");
    // console.log(models);
});

//import routes
import sessionRouter from "./routes/session_routes.js";
import userRouter from "./routes/user_router.js";
import guildRouter from "./routes/guild_router.js";

//use routes
// app.use("/users", userRouter); //user routes
// app.use("/bots", botRouter); //bot routes (wip)
// app.use("/channels", channelRouter); //channel routes (wip)
// app.use("/guilds", guildRouter); //guild routes (wip)

// app.use("/api/*", (q) => {console.log("hit"); console.log("Body:", q.body, '\nHeaders:', q.headers)});
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/guilds", guildRouter);
