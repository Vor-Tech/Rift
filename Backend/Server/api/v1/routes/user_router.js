import express from 'express';
const router = express.Router();

router.post("/", (req, res) => { //create user
    //req params:
    //  user_agent
    //  unknown:
    //      user_params

    //create new user
    //once user saved, login with new user
    //return user information and token
})

//dual define for PUT req
router.patch("/", (req, res) => { //update user
    //req params:
    //  user_params,
    //  current_user: {
    //      ?errors?
    //  }

    //try to update current_user with new attributes
        //return new user data
    //catch:
        //return current_user.errors.full_messages 422
})

router.get("/data", (req, res) => {
//req params:
//  current_user: {
//      id,
//      servers,
//      friendships,
//      dm_channels
//  }

/*
    # This is the code I would actually use; however, to decrease subsequent load times for non-tech people viewing my
    # site, I have temporarily replaced it with a load of all the users.
        # dm_user_ids = [current_user_id]

        # @dm_channels.each do |channel|
        #   dm_arr = channel.name.split('-')
        #   if dm_arr[0].to_i == current_user_id
        #     dm_user_ids << dm_arr[1].to_i
        #   else
        #     dm_user_ids << dm_arr[0].to_i
        #   end
        # end
        
        # @users = User.distinct.select('users.*').left_outer_joins(:friend_requests)
        #   .left_outer_joins(:incoming_friend_requests).left_outer_joins(:friendships)
        #   .where("incoming_friend_requests_users.user_id = :current_user_id OR friend_requests.friend_id = :current_user_id OR friendships.friend_id = :current_user_id OR users.id IN (:dm_user_ids)", current_user_id: current_user_id, dm_user_ids: dm_user_ids)
        #   .includes(:sessions, :server_memberships)
*/

//set current_user_id to current_user.id
//set servers to all the servers the user is a member of.
//set audio_channels to servers.map(audio_channels)
//set requests to FriendRequests.where(friend_id /*to be changed to recipient or sender*/: current_user_id) || FriendRequests.where(user_id /*to be changed to recipient or sender*/: current_user_id)
//set friendships to current_user.friendships
//set dm_channels to current_user.dm_channels

//skipping for concept

// !!IMPORTANT: MUST FIX FOR PROD!!
//set users to all users who share a server or dm with the current user 

//return result to api/users/user_data
});

router.delete("/", (req, res) => {
    //authenticate current user
    //destroy current session
    //remove user from all servers
    //all dms to DELETED ACCOUNT and update messages database to reflect such
    //delete all servers where the deleted user was the only member
});

/*
private

  def user_params
    params.require(:user).permit(:username, :password, :email, :avatar)
  end
*/