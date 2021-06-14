import React, {useState, useEffect} from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Axios from "axios";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
import Login from "./components/layout/auth/Login";
import Register from "./components/layout/auth/Register";
import UserContext from "./context/UserContext";
import Messager from "./components/pages/Messager";

import "./App.css";

export default function App() {
    let [token, setToken] = useState(null)
    let [userData, setUserData] = useState({})

    useEffect(() => {
        const checkLoggedIn = async () => {
            let storageToken = localStorage.getItem("auth-token");
            setToken({token: storageToken});
            if(storageToken === null) {
                localStorage.setItem("auth-token", "");
            }
            const tokenRes = await Axios.get(
                "http://localhost:5000/users/resolve-token", //TODO adapt users/ api endpoint for resolving with token 
                {headers: {"x-auth-token": storageToken}}
            );
            setToken(tokenRes)
            setUserData({
                id: tokenRes.data.id,
                icon: tokenRes.data.icon,
                displayName: tokenRes.data.displayName,
                discriminator: tokenRes.data.discriminator
            })
                
        }
        checkLoggedIn();
    }, [])

    return <>
        <BrowserRouter>
        <UserContext.Provider value={{userData, setUserData, token, setToken}}>
            <Header />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/messenger" component={Messager} />
                </Switch>
            </UserContext.Provider>
        </BrowserRouter>
    </>;
}