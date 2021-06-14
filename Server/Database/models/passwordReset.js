import mongoose from "mongoose";
 const  passwordSchema =  new mongoose.Schema({
     date: String,
     email: String
 })

const passwordReset = new mongoose.model('passwordReset', passwordSchema)
export default passwordReset;