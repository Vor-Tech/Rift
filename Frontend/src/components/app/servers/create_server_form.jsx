import {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

function CreateServerForm(props) {
  let nameInput = '';
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const getCurrentUser = state => state.session.id;
  const sessionId = useSelector(getCurrentUser);
  console.log("SESSION_ID ",sessionId);

  useEffect(() => {
    nameInput.focus();
    
  });
  
  const handleRedirect = (action) => {
    console.log(123,action)
    props.closeModal();
    props.history.push(`/channels/${action.server.data.id}/${action.server.data.root_channel}`);
  }

  const handleFile = (e) => {
    const file = e.currentTarget.files[0];
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      setAvatarFile(file);
      setAvatarUrl(fileReader.result);
    };

    if (file) {
      fileReader.readAsDataURL(file);
    }
  }

  const handleRemove = (e) => {
    setAvatarFile(null);
    setAvatarUrl(null);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // formData.append('server[name]', name).then((v) => console.log(v)); //! change server[name]

    if (avatarFile) {
      // formData.append('server[icon]', avatarFile); //! change server[icon]
    }

    props.createServer({name: name, current_user_id: sessionId, avatarFile: avatarFile, avatarUrl: avatarUrl}).then((data) => handleRedirect(data));
  }
  
  return (
    <form className="create-server-form" onSubmit={handleSubmit}>
      <div className="create-server-form-top">
        <h5>CREATE YOUR SERVER</h5>
        <p>By creating a server you will have access to free text chat to use amongst your friends.</p>
        <div className="create-server-input-container">
          <div className="create-server-form-input">
            <label id={props.errors[0] ? 'server-errors' : ''}>SERVER NAME
            <span>{props.errors[0] ? `  -  ${props.errors[0]}` : ''}</span>
            </label>
            <input type="text" placeholder="Enter a server name" onChange={(e) => setName(e.target.value)} ref={(input) => { nameInput = input; }} />
          </div>
          <div className="avatar-container" id="icon-container">
            <div
              className="avatar-wrapper"
              id="icon-wrapper"
              style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : { backgourndColor: '#7289da' }}
            >
              <p>{'CHANGE \n ICON'}</p>
              <input type="file" onChange={handleFile} onKeyDown={(e) => e.preventDefault()} multipleaccept=".jpg,.jpeg,.png,.gif" />
              <div className="add-file-icon"></div>
            </div>
            {avatarUrl ? <button
              className="remove-avatar-button"
              type="button"
              onClick={handleRemove}
            >REMOVE</button> : null}
          </div>
        </div>
      </div>
      
      <div className="create-server-form-bottom">
        <button>Create</button>
      </div>
    </form>
  )
}

export default withRouter(CreateServerForm);
