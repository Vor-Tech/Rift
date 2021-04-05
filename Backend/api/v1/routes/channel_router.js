import express from 'express';
const router = express.Router();

router.get("/", (req, res) => { //index channels
    //req params:
    //  server_id,
    //  ?channel_params,
    
    //resolve server with provided id
    //if server: set channels to server.channels
    //  return channels
    //else: return Server does not exist 422
});

router.post("/:id", (req, res) => { //create channel
    //req params:
    //  id,
    //  user
    
    //check permissions for user and given server
    //  if has permission: check for channel params
    //  else: return missing permissions 401
    //  if channel params: create channel and save
    //  else: create channel with default params and save
    //  return new channel
    // catch: return json channel.errors.full_message 422
});

router.delete("/:id", (req, res) => {
    //req params:
    //  id,
    //  user

    //check permissions
    //if has permission: resolve channel
    //  if channel: delete channel, return 200
    //  else: return channel not found 404
    // else: return missing permissions 401
});