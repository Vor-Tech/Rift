import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

function SignupForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email   , setEmail   ] = useState('');

  useEffect(() => {
    document.body.style = "overflow: hidden;";
    // nameInput.focus();
  })

  function componentWillUnmount() {
    document.body.removeAttribute("style");
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.signup({email, username, password}).then(() => props.history.push('/channels/@me'));
  }

  const emailError = props.errors.find((el) => el.includes('Email'));
  const usernameError = props.errors.find((el) => el.includes('Username'));
  const passwordError = props.errors.find((el) => el.includes('Password'));
  
  return (
    <div className="login-body" style={{backgroundColor: "darkgrey"}}>
      <form action="" className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-inner">
          <h3 className="form-header">Create an account</h3>
          <div className="form-input">
            <div className="email-container">
              <div className="session-error-wrapper">
                <h5 className={`email-label ${emailError ? 'session-error-label' : ''}`}>EMAIL</h5>
                <span className="session-errors">{emailError ? `-  ${emailError}` : ''}</span>
              </div>
              <input type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={emailError ? 'session-error' : 'session-input'}
                // ref={(input) => { nameInput = input; }}
              />
            </div>
            <div>
              <div className="session-error-wrapper">
                <h5 className={`email-label ${usernameError ? 'session-error-label' : ''}`}>USERNAME</h5>
                <span className="session-errors">{usernameError ? `-  ${usernameError}` : ''}</span>
              </div>
              <input type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={usernameError ? 'session-error' : 'session-input'}
              />
            </div>
            <div>
              <div className="session-error-wrapper">
                <h5 className={`email-label ${passwordError ? 'session-error-label' : ''}`}>PASSWORD</h5>
                <span className="session-errors">{passwordError ? `-  ${passwordError}` : ''}</span>
              </div>
              <input type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={passwordError ? 'session-error' : 'session-input'}
                id="password-container"
              />
            </div>
            <div className="forgot-password-container">
            </div>
            <button id="session-submit">Register</button>
            <div className="need-account">
            <span>Already have an account?</span>
              <Link to="/login" onClick={() => props.removeErrors()}>Login</Link>
              
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignupForm;