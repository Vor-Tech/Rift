import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '../modal/tooltip';

const DmNotification = (props) => {
  const [classText, setClassText] = useState();

  useEffect(() => {
    setTimeout(() => setClassText('dm-notification right'), 200)
  });
  
  return (
    <Tooltip component={
      <Link to={`/channels/@me/${props.notification.channelId}`}
        className={`home-icon ${classText}`}
        id={`dm-notification-${props.notification.channelId}`}
        style={{ backgroundImage: `url(${props.user.image_url})`, backgroundSize: '100%'}}
        onKeyDown={(e) => e.preventDefault()}
      >
        <div className="dm-notification-badge">{props.notification.count}</div>
      </Link>
    }
      position="right center"
      text={props.user.username}
    />
  )
};

export default DmNotification;