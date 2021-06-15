import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import { TextField } from "@material-ui/core";
import Axios from "axios";
import "./auth.scss"

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const {setUserData} = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        const loginUser = {email, password};
        const loginRes = await Axios.post("http://localhost:5000/users/login", loginUser);

        setUserData({
            ...loginRes.data.user,
            token: loginRes.data.token,
        });

        localStorage.setItem("auth-token", loginRes.data.token);
        history.push("/");
    }

    return (
        <div>
            <center><h2 className="page">Login</h2></center>
            
            <form onSubmit={submit}>
                <div className="input-box">
                    <TextField
                        label="Email"
                        variant="outlined"
                        id="login-email"
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-box">
                    <TextField
                        label="Password"
                        variant="outlined"
                        id="login-password"
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <center><input type="submit" value="Login" /></center>
            </form>
        </div>
    )
}
