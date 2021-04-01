import express from 'express';
const router = express.Router();

router.delete("/:id", (req, res) => { //remove friend
    //req params:
    //  user,
    //  target_user :id

    //resolve target_user
    //if target_user: 
        // if friends: remove friends
        // else: return friend not found 422
    //else: return target_user not found 422
});

router.patch("/:id", (req, res) => { //block
    //req params:
    // user,
    // target_user :id
    
    //resolve target_user
    //if target_user: =>
    //else: return target user not found 422
    //if target_user and user are friends: remove friends
    //add target user to blocked list
    //
});

/*
private

  def current_friend
    @friend ||= current_user.friends.find(params[:id])
  end
*/