import React, {useContext, useEffect, useRef, useState} from "react";
import UserContext from "../../context/UserContext";

// import config from "./config";
// import io from "socket.io-client";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import BottomBar from "../layout/Messaging/BottomBar";
import { ButtonBase } from "@material-ui/core";



export default function Messager() {
  
  // const socket = useRef();

  const {userData, setUserData} = useContext(UserContext);
  
  const [content, setContent] = useState("");
  const [chats, setChats] = useState([]);
  const scrollToBottom=()=> {
    const chat = document.getElementById("chat");
    chat.scrollTop = chat.scrollHeight;
  }

  // useEffect(() => {
  //   socket.current = io("http://localhost:8080");
  //   socket.current.on('connect', () => {
  //     console.log("Connection Established");
  //   });
  //   // Load the last 10 messages in the window.
  //   socket.current.on("init", (msg) => {
  //     let msgReversed = msg.reverse();
  //     setChats((chat) => {
  //       return [...chat, ...msgReversed];
  //     });
  //     scrollToBottom();
  //   });

    // Update the chat if a new message is broadcasted.
    // socket.current.on("push", (msg) => {
    //   console.log(2, msg);
    //   setChats((chat) => {
    //     console.log(3, chat);
    //     return [...chat, msg]; 
    //   });
    //   scrollToBottom();
    //  });
    //  return socket.current.close()
// }, [])

// Save the message the user is typing in the input field.
const handleContent=(event) =>{
  setContent(event.target.value);
}

//
// function handleName(event) {
//   setUserData(() => {
//     if(!username) return {name: event.target.value}
//   });
// }

const handleName = (event) => {
  setUserData((userData) => ({
    ...userData,
    user: {
      ...userData.displayName
    }
  }));
}

const handleSubmit = async (event) => {
  // Prevent the form to reload the current page.
  event.preventDefault();
  // socket.current = io("http://localhost:8080");
  // Send the new message to the server.
  // socket.current.emit("message", {
  //   author: {
  //     displayName: userData.displayName,
  //     discriminator: userData.discriminator,
  //     id: userData.id
  //   },
  //   channel_id: 'testing',
  //   content: [content],
  // });
  //clear input bar
  setContent('');

  //Removed because double author
  // setChats((chat) =>
  //   // Update the chat with the user's message and remove the current message.
  //   [...chat, { author: {displayName: userData.displayName}, content: event.target.value /*state.content*/}]
  // );
  
  scrollToBottom();
}

return (
  <div className="App">
    <Paper id="chat" elevation={3}>
      {chats.map((el, index) => {
        return (
          <div key={index}>
            <Typography variant="caption" className="name">
              <ButtonBase> {el.author?.displayName ? (el.author?.displayName+'#'+el.author?.discriminator) : ('Anonymous')} </ButtonBase> {/*TODO display sent_at on hover, hide tag until hover, fix onClick, make custom button*/}
            </Typography>
            <Typography variant="body1" className="content" style={{paddingLeft: '.75%'}}> {/*TODO add line wrapping and remove user tag if above message was sent by same user*/}
              {el.content.length < 10000 ? el.content : alert("Message must be less than 10,000 characters")}
            </Typography>
          </div>
        );
      })}
    </Paper>
    <BottomBar
      content={content}
      handleContent={handleContent}
      handleName={handleName}
      handleSubmit={handleSubmit}
      author={userData.displayName}
    />
  </div>
)}


//ref

// class Messager extends React.Component {

//   constructor(props) {
//     const {userData, setUserData} = useContext(UserContext);

//     let history = useHistory();

//     super(props,setUserData);

//     this.state = {
//       chat: [],
//       content: "",
//       name: userData.user ?  userData.user : "",
//     };
//   }

//   componentDidMount() {
    
//   }

//   // Always make sure the window is scrolled down to the last message.
//   scrollToBottom() {
//     const chat = document.getElementById("chat");
//     chat.scrollTop = chat.scrollHeight;
//   }

//   render() {
    // return (
    //   <div className="App">
    //     <Paper id="chat" elevation={3}>
    //       {this.state.chat.map((el, index) => {
    //         return (
    //           <div key={index}>
    //             <Typography variant="caption" className="name">
    //               {el.name}
    //             </Typography>
    //             <Typography variant="body1" className="content">
    //               {el.content}
    //             </Typography>
    //           </div>
    //         );
    //       })}
    //     </Paper>
    //     <BottomBar
    //       content={this.state.content}
    //       handleContent={this.handleContent.bind(this)}
    //       handleName={this.handleName.bind(this)}
    //       handleSubmit={this.handleSubmit.bind(this)}
    //       name={this.state.name}
    //     />
    //   </div>
//     );
//   }
// }

// export default Messager;

