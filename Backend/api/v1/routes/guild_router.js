import express from 'express';
import Guild from "../../../Database/models/guildModel.js";
const router = express.Router();

router.post("/join", (req, res) => {
    let action = "join server"
    console.log(`${action}:`, req);
    return res.status(422).json({msg: action});
    //req params:
    //  current_user,
    //  server_params: {
    //      id
    //?
    //  }
    //? {}

    //resolve server id to server => server
    //if server: 
    //  current_user.servers = {
    //    ...current_user.servers,
    //    server
    // }
    //  return the newly joined server object
    //else: return server does not exist 404
});

router.get("/:id/members", (req, res) => {
    let action = "get members";
    console.log(`${action}:`, req);
    return res.status(202).json({msg: action});
    //req params:
    //  server_id,
    //  current_user
    //? {}

    //resolve server_id => server.members => users
    //return list of members 200
    //catch return cannot resolve server 404
});

router.get("/", (req, res) => { //index
    let action = "index servers";
    console.log(`${action}:`, req);
    return res.status(422).json({msg: action});
    //req params:
    //  current_user,

    //resolve ServerModel.all.forEach(server => members.includes(current_user))
    //return servers 200
});

router.post("/", async (req, res) => {
    let action = "create server";
    console.log(`${action}:`, req.body.data);
    const { name , current_user_id} = req.body.data;
    // if(current_user) {}

    let newGuild = new Guild({name: name, owner_id: current_user_id});
    let savedGuild = await newGuild.save();    
    return res.status(200).json({
      owner_id: savedGuild.owner_id,
      id: savedGuild._id,
      name: savedGuild.name,
      channels: savedGuild.channels,
      roles: savedGuild.roles,
      confirm: true
    });

    //req params:
    //  current_user
    //  server_params: {
    //?   name,
    //?   icon_url
    //?   ???
    //  }

    //create new server from server_params => server
    //if server:
    //  create new channel "general"
    //  create new audio channel "General"
    //  return new server 200
    //else: return could not create server 422
});

/*
private

  def current_server
    @server ||= Server.find_by(id: params[:id])
  end

  def server_params
    params.require(:server).permit(:name, :icon)
  end
*/

export default router;