import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    displayName: {type: String, required: true, minlength: 4},
    icon: {type: String},
    descriminator: {type: Number, required: true, length: 5},
    blocked_users: {type: Array},
    friend_requests: {type: Array},
    friends: {type: [Object]},
});

const User = mongoose.model("User", userSchema);

export default User;