import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';

const JoinServerForm = (props) => {
  const [name, setName] = useState('');

  // componentDidMount() {
  //   this.nameInput.focus();
  // }

  useEffect(() => {
    nameInput.focus();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    this.props.joinServer({name}, props.currentUserId).then(handleRedirect);
  }

  const handleRedirect = (action) => {
    this.props.closeModal();
    this.props.history.push(`/channels/${action.server.id}/${action.server.root_channel}`);
  }

  
  return (
    <form className="create-server-form" onSubmit={handleSubmit}>
      <div className="create-server-form-top">
        <h5 id="join-server-header">JOIN A SERVER</h5>
        <p id="join-server-message">Enter a server name below to join an existing server.</p>
        <div className="create-server-form-input">
          <label id={props.errors[0] ? 'server-errors' : ''}>SERVER NAME
            <span>{props.errors[0] ? `  -  ${props.errors[0]}` : ''}</span>
          </label>
          <input id="join-server-text-input" type="text" placeholder="Enter a server name" onChange={(e) => setName(e.currentTarget.value)} ref={(input) => { nameInput = input; }} />
        </div>
      </div>
      
      <div className="create-server-form-bottom" style={{marginTop: '105px'}}>
        <button id="join-server-button">Join</button>
      </div>
    </form>
  )
}

export default withRouter(JoinServerForm);
