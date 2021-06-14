import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { default as env } from "dotenv";

env.config();
//express

const app = express();
app.use(express.json());
app.use(cors());

const PORT = env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//mongoose

const uri = env.MONGODB_CONNECTION_STRING || "mongodb://localhost:27017";
mongoose.connect(
  uri,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB Connected");
  }
);

import userRouter from "./routes/userRouter.js";
import botRouter from "./routes/botRouter.js";
import channelRouter from "./routes/channelRouter.js";
import guildRouter from "./routes/guildRouter.js";

//routes
app.use("/users", userRouter); //user routes
app.use("/bots", botRouter); //bot routes (wip)
app.use("/channels", channelRouter); //channel routes (wip)
app.use("/guilds", guildRouter); //guild routes (wip)
