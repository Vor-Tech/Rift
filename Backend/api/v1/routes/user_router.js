import express from 'express';
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import User from "../../../Database/models/userModel.js"
const router = express.Router();

let userIncrement = 0

router.post("/", async (req, res) => {
    try {
        //derive body data
        // console.log(req.body)
        let { email, password, username } = req.body.data.user;

        //validate
            //check if email is valid    
            if(!email || email?.split('@').length == 1) return res.status(400).json({msg: "Invalid Email"});
            
            const existingUser = await User.findOne({email: email});
            if(existingUser) return res.status(422).json({msg: "An account with this email already exists."})
            if(!password) return res.status(400).json({msg: "No password was supplied"});
            if(!username) username = email.split('@')[0];
            if(password.length < 6) return res.status(400).json({msg: "Password must be at least 6 characters long"});

        //crypt
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)
        
        //increment user counter
        userIncrement++;

    //  ##############
    //  ## user gen ##
    //  ##############

        //generate id
        let id = (Date.now() + process.pid + userIncrement);

        //generate discriminator
        let discriminator = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

        //create new user object
        const newUser = new User({
            id,
            email,
            password: passwordHash,
            username,
            discriminator,
            created_at: new Date().toUTCString()
        });

        //save new user to database
        const savedUser = await newUser.save();
        
        //filter out sensitive information from response object
        let resUser = {
            id: savedUser.id,
            email: savedUser.email,
            displayName: savedUser.displayName,
            discriminator: savedUser.discriminator,
        };

        //send response
        res.json(resUser);
    }
    catch (err) {
        console.error(`[${new Date().toLocaleTimeString()}]`, err)
        return res.status(500).json({error: "Internal server error"})
    }
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
    console.log(req.body)
    // query from database and return channels, voice_channels, users, servers, friend_requests, friends, currentUserId
    res.status(200).json({
        "channels":{
            "38":{
                "id":38,
                "name":"general",
                "server_id":1
            },
            "28":{
                "id":28,
                "name":"general",
                "server_id":2
            },
            "29":{
                "id":29,
                "name":"Lannisters are the worst",
                "server_id":2
            },
            "30":{
                "id":30,
                "name":"general",
                "server_id":3
            },
            "34":{
                "id":34,
                "name":"general",
                "server_id":4
            },
            "32":{
                "id":32,
                "name":"general",
                "server_id":5
            },
            "35":{
                "id":35,
                "name":"general",
                "server_id":6
            },
            "33":{
                "id":33,
                "name":"general",
                "server_id":7
            },
            "31":{
                "id":31,
                "name":"general",
                "server_id":8
            },
            "36":{
                "id":36,
                "name":"general",
                "server_id":9
            },
            "37":{
                "id":37,
                "name":"general",
                "server_id":10
            },
            "2":{
                "id":2,
                "name":"2-97",
                "server_id":null
            }
        },
        "voice_channels":{
            "11":{
                "id":11,
                "name":"General",
                "server_id":1
            },
            "1":{
                "id":1,
                "name":"General",
                "server_id":2
            },
            "2":{
                "id":2,
                "name":"Is winter coming?",
                "server_id":2
            },
            "3":{
                "id":3,
                "name":"General",
                "server_id":3
            },
            "7":{
                "id":7,
                "name":"General",
                "server_id":4
            },
            "5":{
                "id":5,
                "name":"General",
                "server_id":5
            },
            "8":{
                "id":8,
                "name":"General",
                "server_id":6
            },
            "6":{
                "id":6,
                "name":"General",
                "server_id":7
            },
            "4":{
                "id":4,
                "name":"General",
                "server_id":8
            },
            "9":{
                "id":9,
                "name":"General",
                "server_id":9
            },
            "10":{
                "id":10,
                "name":"General",
                "server_id":10
            }
        },
        "users":{
            "1":{
                "id":1,
                "username":"pod",
                "email":"pod@pod.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/green.png",
                "servers":[1,2,3,4,5,6,7,8,9,10],
                "online":true
            },
            "2":{
                "id":2,
                "username":"hodor",
                "email":"hodor@hodor.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/blue.png",
                "servers":[1,2,3,4,5,6,7,8,9,10],
                "online":true
            },
            "3":{
                "id":3,
                "username":"ned",
                "email":"ned@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/yellow.png",
                "servers":[1,2],
                "online":true
            },
            "4":{
                "id":4,
                "username":"daenerys",
                "email":"daenerys@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/yellow.png",
                "servers":[3,1],
                "online":false
            },
            "5":{
                "id":5,
                "username":"robert",
                "email":"robert@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/yellow.png",
                "servers":[4,1],
                "online":false
            },
            "6":{
                "id":6,
                "username":"tywin",
                "email":"tywin@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/gray.png",
                "servers":[5,1],
                "online":false
            },
            "7":{
                "id":7,
                "username":"margaery",
                "email":"margaery@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/blue.png",
                "servers":[6,1],
                "online":false
            },
            "8":{
                "id":8,
                "username":"catelyn",
                "email":"catelyn@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/yellow.png",
                "servers":[2,7,1],
                "online":false
            },
            "9":{
                "id":9,
                "username":"oberyn",
                "email":"oberyn@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/gray.png",
                "servers":[8,1],
                "online":false
            },
            "10":{
                "id":10,
                "username":"theon",
                "email":"theon@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/yellow.png",
                "servers":[9,1],
                "online":false
            },
            "11":{
                "id":11,
                "username":"littlefinger",
                "email":"littlefinger@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/blue.png",
                "servers":[10,1],
                "online":false
            },
            "12":{
                "id":12,
                "username":"arya",
                "email":"arya@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/blue.png",
                "servers":[2,1],
                "online":false
            },
            "13":{
                "id":13,
                "username":"jon",
                "email":"jon@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/red.png",
                "servers":[2,3,1],
                "online":false
            },
            "14":{
                "id":14,
                "username":"bran",
                "email":"bran@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/yellow.png",
                "servers":[2,1],
                "online":false
            },
            "15":{
                "id":15,
                "username":"sansa",
                "email":"sansa@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/blue.png",
                "servers":[2,1],
                "online":false
            },
            "16":{
                "id":16,
                "username":"rickon",
                "email":"rickon@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/blue.png",
                "servers":[2,1],
                "online":false
            },
            "17":{
                "id":17,
                "username":"joffrey",
                "email":"joffrey@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/gray.png",
                "servers":[5,1,4],
                "online":false
            },
            "18":{
                "id":18,
                "username":"tommen",
                "email":"tommen@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/blue.png",
                "servers":[5,1,4],
                "online":false
            },
            "19":{
                "id":19,
                "username":"myrcella",
                "email":"myrcella@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/gray.png",
                "servers":[5,1,4],
                "online":false
            },
            "20":{
                "id":20,
                "username":"cersei",
                "email":"cersei@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/green.png",
                "servers":[5,1,4],
                "online":false
            },
            "21":{
                "id":21,
                "username":"jaime",
                "email":"jaime@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/gray.png",
                "servers":[1,5],
                "online":false
            },
            "22":{
                "id":22,
                "username":"tyrion",
                "email":"tyrion@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/yellow.png",
                "servers":[1,5],
                "online":false
            },
            "23":{
                "id":23,
                "username":"loras",
                "email":"loras@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/red.png",
                "servers":[1,6],
                "online":false
            },
            "24":{
                "id":24,
                "username":"reek",
                "email":"reek@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/yellow.png",
                "servers":[1,9],
                "online":false
            },
            "25":{
                "id":25,
                "username":"robin",
                "email":"robin@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/blue.png",
                "servers":[1,10],
                "online":false
            },
            "26":{
                "id":26,
                "username":"lysa",
                "email":"lysa@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/blue.png",
                "servers":[10,1,7],
                "online":false
            },
            "27":{
                "id":27,
                "username":"door",
                "email":"door@gmail.com",
                "image_url":"https://s3.amazonaws.com/discors-dev/User+Icons/yellow.png",
                "servers":[],
                "online":false
            }
        },
        "servers":{
            "1":{
                "id":1,
                "name":"westeros",
                "admin_id":1,
                "icon_url":"",
                "root_channel":38
            },
            "2":{
                "id":2,
                "name":"stark",
                "admin_id":3,
                "icon_url":"",
                "root_channel":28
            },
            "3":{
                "id":3,
                "name":"targaryen",
                "admin_id":4,
                "icon_url":"",
                "root_channel":30
            },
            "4":{
                "id":4,
                "name":"baratheon",
                "admin_id":5,
                "icon_url":"",
                "root_channel":34
            },
            "5":{
                "id":5,
                "name":"lannister",
                "admin_id":6,
                "icon_url":"",
                "root_channel":32
            },
            "6":{
                "id":6,
                "name":"tyrell",
                "admin_id":7,
                "icon_url":"",
                "root_channel":35
            },
            "7":{
                "id":7,
                "name":"tully",
                "admin_id":8,
                "icon_url":"",
                "root_channel":33
            },
            "8":{
                "id":8,
                "name":"martell",
                "admin_id":9,
                "icon_url":"",
                "root_channel":31
            },
            "9":{
                "id":9,
                "name":"greyjoy",
                "admin_id":10,
                "icon_url":"",
                "root_channel":36
            },
            "10":{
                "id":10,
                "name":"arryn",
                "admin_id":11,
                "icon_url":"",
                "root_channel":37
            }
        },
        "friend_requests":{
            "1":{
                "id":1,
                "user_id":17,
                "friend_id":2
            },
            "2":{
                "id":2,
                "user_id":24,
                "friend_id":2
            },
            "3":{
                "id":3,
                "user_id":4,
                "friend_id":2
            },
            "4":{
                "id":4,
                "user_id":27,
                "friend_id":2
            }
        },
        "friends":[14,12,3,15,13,8,16],
        "currentUserId":2 //! figure this out
    });
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

export default router;