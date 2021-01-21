import express from 'express';
const router = express.Router();
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";
import Role from "../../models/roleModel.js";

const administrator = [
    "add_widgets",
    "add_bots",
    "add_modules",
    "stream",
    "use_voice_activity",
    "manage_channels",
    "manage_permissions",
    "manage_messages",
    "manage_roles",
    "manage_server",
    "manage_users",
    "send_messages",
    "send_media",
    "send_files",
    "send_links",
    "send_tts",
    "read_messages",
    "read_message_history",
    "view_audit_logs"
];

router.post("/create", async (req,res) => {
    try {
        let { user, token, guild, role_name } = req.body;

        //validate
        if(!token && !user) return res.status(400).json({msg: "No user or token provided"});
        if(!role_name) return res.status(400).json({msg: "No role name "});
        if(!user) user = Axios.get("http://localhost:5000/users/resToken", {"x-auth-token": token})
        if(!role_name) role_name = "New Role";

        //user gen
        const newRole = new Role({
            role_name,
            createdAt: `[${new Date().toUTCString()}]`
        });

        if(guild) newRole.guild = guild;

        const savedRole = await newRole.save();
        res.json(savedRole);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"});
        console.error(`[${new Date().toLocaleTimeString()}]`, err);
    }
})

router.delete("/delete", auth, async (req, res) => {
    try{
        console.log(req.user)
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"})
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
    }
}) //later path: /close

router.post("/tokenValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if(!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if(!user) return res.json(false);

        return res.json(true);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"})
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
    }
})

router.post("/resToken", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if(!token) return res.json({token_provided: false});

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) return res.json({valid_token: false});

        const user = await User.findById(verified.id);
        if(!user) return res.json({valid_user: false});

        return res.json(user);
    }
    catch (err) {
        res.status(500).json({error: "Internal server error"})
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
    }
})

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        displayName: user.displayName,
        id: user._id,
    });
})

export default router;