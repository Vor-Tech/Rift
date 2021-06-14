import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  displayName: { type: String, required: true, minlength: 4 },
  icon: { type: String },
  discriminator: { type: String, required: true, length: 5 },
  blocked_users: { type: Array },
  friend_requests: { type: Array },
  friends: {
    type: [
      {
        id: String,
        displayName: String,
        discriminators: String,
        logo: String,
        notes: String,
        // badges: [Object],
        // linkedAccounts: [Object]
      },
    ],
    required: false,
  },
  created_at: { type: Date },
  edited_at: {
    type: [
      {
        edit: [
          [Object, Date] /*original*/,
          [Object, Date] /*edited*/,
        ],
      },
    ],
    required: false,
  },
  badges: { type: [Number] },
  achievements: { type: [Number], required: false },
  linkedAccounts: { type: [Object] },
    id: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    displayName: {type: String, required: true, minlength: 4},
    icon: {type: String},
    discriminator: {type: String, required: true, length: 5},
    blocked_users: {type: Array},
    friend_requests: {type: Array},
    friends: {type: 
        [{
            id: String,
            displayName: String,
            discriminators: String,
            logo: String,
            notes: String,
            // badges: [Object],
            // linkedAccounts: [Object]
        }],
        required: false
    },
    created_at: {type: Date},
    edited_at: {type: [{
        edit: [[Object, Date] /*original*/, [Object, Date] /*edited*/]
      }], required: false},
    badges: {type: [Object]},
    achievements: {type: [Object], required: false},
    linkedAccounts: {type: [Object]},
    passwordResetsRequests: {type: Number}
});

const User = mongoose.model("User", userSchema);

export default User;
