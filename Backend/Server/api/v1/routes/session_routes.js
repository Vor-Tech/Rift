import express from 'express';
const router = express.Router();

router.post("/", (req, res) => {
    let action = "gen session"
    console.log(`${action}:`, req);
    return res.status(422).json({msg: action});
    //req params: 
    //  username,
    //  password,
    //  user_agent

    //find user

    //if user: try logging in
        //reset session token

        //if login: return result user data and token
    //else
        //send 401 status, invalid username/password
});

router.delete("/", (req, res) => {
    let action = "destroy session";
    console.log(`${action}:`, req);
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