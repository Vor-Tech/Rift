import express from "express";
const router = express.Router();

import Channel from "../../Database/models/channelModel.js";

router.post("/create", async (req, res) => {
  try {
    let { owner, token, channel_type, channel_name, guild } = req.body;

    //validate
    if (!owner && !token)
      return res.status(400).json({ msg: "No owner or token provided" });
    if (!owner) return res.status(400).json({ msg: "Account error" });

    let guild_channel;
    if (channel_type == "text" || channel_type == "voice") guild_channel = true;

    if (
      !guild_channel &&
      channel_type !== "dedicated" &&
      channel_type !== "forum"
    )
      return res.status(400).json({ msg: "Bad channel type" });

    //check if permissions allow
    if (guild_channel)
      newChannel = new Channel({
        instantiator: owner.user.displayName,
        channel_name,
        channel_type,
        createdAt: new Date().toUTCString(),
      });

    if (guild) newChannel.guild = guild;

    const savedChannel = await newChannel.save();
    res.json(savedChannel);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    console.error(`[${new Date().toLocaleTimeString()}]`, err);
  }
});

export default router;
