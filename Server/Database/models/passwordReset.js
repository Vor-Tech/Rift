import mongoose from "mongoose";

const  passwordSchema =  new mongoose.Schema({
     date:  Date,
     jwt:  String
 })

const passwordReset = new mongoose.model('passwordReset', passwordSchema)
export default passwordReset;