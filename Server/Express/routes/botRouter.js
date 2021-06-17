import express from "express";
const router = express.Router();

import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";
import Bot from  "../../Database/models/botModel.js";
import User from "../../Database/models/userModel.js";

let botIncrement = 0;

router.post("/create", async (req, res) => {
  try {
    let { owner, token, botDisplayName, icon } = req.body;

    if (!token && !owner)
      return res.status(400).json({ msg: "No user or token provided" });
    if (!owner) return res.status(400).json({msg: "Account error: no owner."});
    //validate
    if (!owner.data.user.id)
      return res.status(400).json({ msg: "Account error." });

    let existingBot = await Bot.findOne({
      ownerid: loginRes.data.user.id,
      botDisplayName: botDisplayName,
    });
    if (existingBot)
      return res
        .status(400)
        .json({ msg: "A bot with this name on this account already exists." });
    if (!icon)
      icon = acronym = botDisplayName.split(" ").forEach((word) => word[0]);
    //bot gen

    // token: String,
    // icon: String,
    // intents: Array,
    // createdAt: Date,
    // editedAt: [Object],
    // id: String,

    botIncrement++;
    let id = Date.now() + process.pid + botIncrement;

    const newBot = new Bot({
      id,
      owner,
      displayName: botDisplayName,
      icon,
      createdAt: new Date().toUTCString(),
    });

    const savedBot = await newBot.save();

    savedBot.token = jwt.sign({ id: savedBot._id }, process.env.JWT_SECRET);

    res.json(savedBot);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    // console.error(`[${new Date().toLocaleTimeString()}]`, err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate
    if (!user) return res.status(400).json({ msg: "Invalid credentials." });
    if (!password)
      return res
        .status(400)
        .json({ msg: `No password for ${user.displayName} was supplied` });
    if (!id) return res.status(400).json({ msg: "No bot ID was supplied" });
    const bot = await Bot.findOne({ owner: user, _id: id });
    if (!bot)
      return res
        .status(400)
        .json({
          msg: `No bot under the account ${user.displayName} with the id ${id} could be found.`,
        });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    if (passMatch === true) {
      res.json({
        token,
        user: {
          id: user._id,
          displayName: user.displayName,
          email: user.email,
        },
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    console.error(`[${new Date().toLocaleTimeString()}]`, err);
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    console.log(req.user);
    const deletedUser = await Bot.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    console.error(`[${new Date().toLocaleTimeString()}]`, err);
  }
}); //later path: /close

router.post("/tokenValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    console.error(`[${new Date().toLocaleTimeString()}]`, err);
  }
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
  });
});

export default router;
