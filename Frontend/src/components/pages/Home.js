import React, {useContext} from 'react';
import Messager from './Messager';
import UserContext from "../../context/UserContext";

export default function Home() {
    const {userData} = useContext(UserContext);

    return (
        <div>
            {userData.user || localStorage.getItem("auth-token") ? (
                <Messager />
            ) : ( 
                <>
                <h1 className='loginRequired' style={{textAlign: 'center', paddingTop: '1%'}}>You must login or create an account</h1>
                </>
            )}            
        </div>
    )
}
