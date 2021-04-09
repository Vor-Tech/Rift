import mongoose from "mongoose";

export const user_schema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    username: {type: String, required: true, minlength: 4},
    icon: {type: String},
    discriminator: {type: String, required: true, length: 5},
    guilds: {type: Object},
    commendations: {type: Object},
    blocked_users: {type: Array},
    friend_requests: {type: Array},
    friends: {type: [Object]},
    created_at: {type: Date}
});

const User = mongoose.model("User", user_schema);

export default User;