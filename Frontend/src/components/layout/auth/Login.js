import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import Axios from "axios";

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
            <h2 className="page">Login</h2>
            
            <form onSubmit={submit}>
                <div>
                <label htmlFor="login-email" style={{paddingRight: '.5%'}}>Email</label>
                    <input
                        id="login-email"
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div style={{paddingTop: '1%'}}>
                <label htmlFor="login-password" style={{paddingRight: '.5%'}}>Password</label>
                    <input 
                        id="login-password"
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div>
                <input type="submit" value="Login" style={{paddingLeft: '1%', paddingTop: '1%'}} />
                </div>
            </form>
        </div>
    )
}
