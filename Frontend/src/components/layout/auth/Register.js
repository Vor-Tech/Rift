import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import TextField from '@material-ui/core/TextField';
import Axios from "axios";
import "./auth.scss"

export default function Register() {
    const [email, setEmail] = useState();
    const [displayName, setDisplayName] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();

    const {setUserData} = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        const newUser = {email, password, passwordCheck, displayName};
        let userLog = await Axios.post(
            "http://localhost:5000/users/register",
            newUser
        );

        console.log(userLog);
        
        const loginRes = await Axios.post(
            "http://localhost:5000/users/login", {
                email,
                password
        });
        setUserData({
            token: loginRes.data.token,
            user: loginRes.data.user,
        });
        localStorage.setItem("auth-token", loginRes.data.token);
        history.push("/");
    }
    
    return (
        <div>
            <center><h2 className="page">Register</h2></center>
            <form onSubmit={submit}>                
                <div className="input-box">
                    <TextField
                        label="Email"
                        variant="outlined"
                        id="register-email"
                        // get some regex for checking contents is an email or something
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                
                <div className="input-box">
                    <TextField
                        label="Username"
                        variant="outlined"
                        id="register-display-name"
                        type="text"
                        onChange={e => setDisplayName(e.target.value)}
                        value={displayName}
                    />
                </div>

                <div className="input-box">
                    <TextField 
                        label="Password"
                        variant="outlined"
                        id="register-password"
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <div className="input-box">       
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        onChange={e => setPasswordCheck(e.target.value)}
                    />
                </div>

                <div>
                    <center><input type="submit" value="Register"/></center>
                </div>
            </form>
        </div>
    )
}
