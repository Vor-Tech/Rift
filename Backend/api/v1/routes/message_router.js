import express from 'express';
const router = express.Router();

router.post("/", (req, res) => {
    let action = "create message";
    console.log(`${action}:`, req);
    return res.status(422).json({msg: action});
    //req params:
    //  current_user,
    //  message_params {
    //    content,
    //    channel_id,
    //    files
    //?
    //  }
    //? {}

    //if current_user: resolve current_user.id => author_id;
    //else: return no current_user 422
    //if message_params:
    //  create new message based on message_params
    //  generate unique ID and generate timestamp, apply author_id 
    //  save new message
    //  return
    //else: return could not create message 422
});

router.get("/channel/:id", (req, res) => { //get messages 
    let action = "index messages";
    console.log(`${action}:`, req);
    return res.status(422).json({msg: action});
    //req params:
    //  channel_id :id,
    //  current_user,
    //  period //in which to look for messages to return

    //if channel_id && current_user: resolve channel_id => channel; get current_users permissions for given channel.
    //  if has permissions: return messages
    //  else: return channel not found 404
    //else: return missing parameters 403 (or whatever that would be)
});

router.patch("/:id", (req, res) => { //edit message
    let action = "edit message";
    console.log(`${action}:`, req);
    return res.status(422).json({msg: action});
    //req params:
    //  current_user.id,
    //  message_id :id,
    //  new_message
    
    //resolve message_id => original_message
    //if current_user.id != original_message.author.id return you can only edit your own messages 401
    //if no original_message return orignal_message not found 404
    //if orignal_message == new_message && original_message.files == new_message.files return nothing to do 200 
    //(ask client if message attachments have been updated) if new_message.files && new_message.files != original_message.files: upload new files to cdn and generate links => file_links; orignal_message.files = file_links;
    //if new_message.content != original_message.content: orignal_message.content = new_message.content  
    //save updated message
    //return updated message
});  