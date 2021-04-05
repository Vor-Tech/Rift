import express from 'express';
const router = express.Router();

router.post("/", (req, res) => { //create new DM
    //req params:
    //  target_user_id,
    //  current_user,
    //  dm_channel_params,
    //? {}

    //resolve user_id from dm_channel_params
    //resolve current_user_id from current_user.id
    //if current_user_id != user_id: //cant dm self
    //  set name to `${current_user_id}-${user_id}`
    //  find existing or create new channel
    //  assign new channel to `channel`
    //  create dm membership for each user:: 
    //      channel.dm_memberships.create(user_id: current_user+id);
    //      channel.dm_memberships.create(user_id: user_id);
    //  return new dm channel 200
    //else return cannot dm yourself 401
});

router.delete("/:id", (req, res) => {
    //req params:
    //  id,
    //  current_user,
    //? params: {
    //?
    //? }

    //set channel_id to :id
    //if resolve dm_channel_membership by from channel_id:
    //  delete the dm_channel_membership
    //  return the previous dm_channel_membership
    //else could not resolve dm_channel_membership
    //catch return could not delete the dm_channel_membership 500
});

/*
private

  def dm_channel_params
    params.require(:dm_channel).permit(:user_id)
  end
*/