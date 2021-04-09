import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../../../assets/stylesheets/login.scss";

const LoginForm = (props) => {
    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    // nameInput.focus();
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    props.login({email, password}).then(() => props.history.push('/channels/@me'));
  }
  
    return (
      <div className="login-body" style={{backgroundColor: "darkgrey"}}>
        <form action="" className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-inner">
            <h3 className="form-header">Welcome back!</h3>
            <h4 className="login-form-subtitle">We're so excited to see you again!</h4>
            <div className="form-input">
              <div className="email-container">
                <div className="session-error-wrapper">
                  <h5 className={`email-label ${props.errors[0] ? 'session-error-label' : ''}`}>EMAIL</h5>
                  <span className="session-errors">{props.errors[0] ? `- ${props.errors[0]}` : ''}</span>
                </div>
                <input type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={props.errors[0] ? 'session-error' : 'session-input'}
                  // ref={(input) => { nameInput = input; }}
                />
              </div>
              <div>
                <h5 className={`password-label ${props.errors[0] ? 'session-error-label' : ''}`}>PASSWORD</h5>
                <input type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password-container"
                  className={props.errors[0] ? 'session-error' : 'session-input'}
                />
              </div>
              <div className="forgot-password-container">
                {/* <button type="button" id="demo" onClick={loginAsGuest}>Demo User</button> */}
              </div>
              <button id="session-submit" onClick={() => handleSubmit}>Login</button>
              <div className="need-account">
                <span>Need an account?</span>
                <Link to="/register" onClick={() => props.removeErrors()}>Register</Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }

  export default LoginForm;