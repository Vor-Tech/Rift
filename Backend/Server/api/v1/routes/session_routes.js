import express from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../Database/models/userModel.js"
const router = express.Router();

// router.post("/", (req, res) => {
//     let action = "gen session";
//     console.log(`${action}:`, "\nHeaders:", req.headers, "\nBody:", req.body);
//     return res.status(200).json();
//     //req params: 
//     //  username,
//     //  password,
//     //  user_agent

//     //find user

//     //if user: try logging in
//         //reset session token

//         //if login: return result user data and token
//     //else
//         //send 401 status, invalid username/password
// });



//login
router.post("/", async (req, res) => {
    try {
        const {email, password} = req.body.data.user;
        
        //validate
        if(!email) return res.status(400).json({msg: "No email was supplied"});
        const user = await User.findOne({email: email});
        if(!user) return res.status(400).json({msg: "Invalid credentials."});
        if(!password) return res.status(400).json({msg: "No password was supplied"});

        const passMatch = await bcrypt.compare(password, user.password);
        if(!passMatch) return res.status(400).json({msg: "Invalid credentials."});
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        if(passMatch === true) {
            res.json({
                token,
                user: {
                    id: user.id,
                    displayName: user.displayName,
                    discriminator: user.discriminator,
                    email: user.email,
                },
            });
        }
    } 
    catch (err) {
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
        return res.status(500).json({error: "Internal server error"})
    }
});
router.delete("/", (req, res) => {
    let action = "destroy session";
    console.log(`${action}:`, "\nHeaders:", req.headers, "\nBody:", req.body);
    return res.status(422).json({msg: action});
    //req params:
    // current_user

    //set user to current_user
    //if user: logout((((
            //def logout(user_agent)
            //  current_user.destroy_session!(user_agent)
                //destroy_session: 
                    //def destroy_session!(user_agent)
                    //  user_agent_session = self.sessions.find_by(user_agent: user_agent)
                    //  user_agent_session.destroy if user_agent_session
                    //end
            //  session[:session_token] = nil
            //  @current_user = nil
            //end
        //))))

        //return result to api/users/show
    //else: send 422 status, no one signed in
});

/*
private

  def user_params
    params.require(:user).permit(:username, :password)
  end
*/

export default router;