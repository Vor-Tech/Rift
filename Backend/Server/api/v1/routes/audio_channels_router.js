import express from 'express';
const router = express.Router();

router.get("/", (req, res) => { //index
    //req params:
    //  server_id,
    
    //resolve server id
    //if server: return server.audio_channels 200
    //else: return server not found 422
});

router.post("/", (req, res) => {
    //req params:
    //  server_id,
    //  user

    //resolve server id
    //if server: check user permissions for server
    //  if has permissiosn: check for params
    //      if has params: create new audio_channel and save, then return
    //      else: create default new audio_channel and save, then return
    //  else: return missing permissions 401
    //else: return server not found 422
});

router.delete("/:id", (req, res) => {
    //req params:
    // channel_id :id,
    // server_id,
    // user

    //resolve server id
    //if server: check user permissions for server
    //  if has permissiosn: delete channel, then return 200
    //  else: return missing permissions 401
    //else: return server not found 422
});

/*
private

  def current_audio_channel
    @audio_channel ||= AudioChannel.find(params[:id])
  end

  def audio_channel_params
    params.require(:audio_channel).permit(:name, :server_id)
  end
*/