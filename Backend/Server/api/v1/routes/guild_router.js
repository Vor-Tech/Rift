import express from 'express';
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
    //  current_user.server_memberships.create(server_id: server.id)
    //  return the newly joined server object
    //else: return server does not exist 404
});

router.get("/:id/members", (req, res) => {
    let action = "get members";
    console.log(`${action}:`, req);
    return res.status(422).json({msg: action});
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
})