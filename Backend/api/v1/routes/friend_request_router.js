import express from 'express';
const router = express.Router();

router.post("/", (req, res) => {
    //req params:
    //  friend_reqest_params: {
    //     recipient_id
    //  },
    //  user

    //resolve target user via id
    //if blocked: return unable to send friend request 422
    //if target user: create new friend request. save friend request, return friend request 200 
    //else: return couldnt find target user 422
    //catch: could not save friend request 500
});

//dual router for put
router.patch("/:id", (req, res) => { //accept friend request
    //req params:
    //  user,
    //  target_user :id
    
    
    //if pending: add user IDs to eachothers friends list, destroy friend request
    //else: return unable to find friend request, try sending one instead 422
    //catch: server error 500
});

router.delete("/:id", (req, res) => {
    //req params:
    // target_user :id,
    // user

    //if friend request exists: destroy friend request and return success 200
    //else: could not find request 422
    //catch: return server error 500
});

/*
private

  def friend_request_params
    params.require(:friend_request).permit(:friend_id)
  end

  def current_friend_request
    @friend_request ||= FriendRequest.find(params[:id])
  end
*/