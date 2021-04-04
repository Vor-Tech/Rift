import express from "express";
import mongoose from "mongoose";
import cors  from "cors";

import {default as env} from 'dotenv';

env.config();
//express

const app = express();
app.use(express.json());
app.use(cors());

const PORT = env.PORT || 1337;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//mongoose

const uri = 'mongodb://localhost:27017';
mongoose.createConnection(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if(err) throw err;
}).then((connection) => {
    console.log(connection.models)
    console.log("MongoDB Connected")
})

// import userRouter from "./routes/userRouter.js";
// import botRouter from "./routes/botRouter.js";
// import channelRouter from "./routes/channelRouter.js";
// import guildRouter from "./routes/guildRouter.js";
import sessionRouter from "./routes/session_routes.js";
import userRouter from "./routes/user_router.js";
//routes
// app.use("/users", userRouter); //user routes
// app.use("/bots", botRouter); //bot routes (wip)
// app.use("/channels", channelRouter); //channel routes (wip)
// app.use("/guilds", guildRouter); //guild routes (wip)

// app.use("/api/*", (q) => {console.log("hit"); console.log("Body:", q.body, '\nHeaders:', q.headers)});
app.use("/api/session", sessionRouter);
app.use("/api/users", userRouter);
