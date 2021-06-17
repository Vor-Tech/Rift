import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import Axios from "axios";

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
            <h2 className="page">Register</h2>
            <form onSubmit={submit}>
                
                <label htmlFor="register-email">Email</label>
                    <input
                        id="register-email"
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                    />

                <label htmlFor="register-display-name">Display Name</label>
                    <input
                        id="register-display-name"
                        type="text"
                        onChange={e => setDisplayName(e.target.value)}
                    />

                <label htmlFor="register-password">Password</label>
                    <input 
                        id="register-password"
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />

                <input type="password" placeholder="Verify Password" onChange={e => setPasswordCheck(e.target.value)} />

                <input type="submit" value="Register"/>

            </form>
        </div>
    )
}
