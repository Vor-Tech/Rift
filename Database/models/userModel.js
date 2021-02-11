import mongoose from "mongoose";
import friendRequestSchema from '../schema/friendRequestSchema.js'

const userSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    displayName: {type: String, required: true, minlength: 4},
    icon: {type: String},
    badges: {type: [Object]},
    achievements: {type: Array},
    discriminator: {type: String, required: true, length: 5},
    notifications: {type: [Object]},
    blocked_users: {type: Array},
    friend_requests: {type: [friendRequestSchema]},
    friends: {type: [String]}, //possibly store basic user data for speed?
    updated_at: {type: [[Date, Object]]},
    created_at: {type: Date}
});

const User = mongoose.model("User", userSchema);

export default User;