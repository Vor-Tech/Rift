import Axios from 'axios';

export const createChannel = channel => (
  Axios.post('http://localhost:5000/api/v1/channels',
    {data: { channel }}
  )
);

export const createDmChannel = user_id => (
  Axios.post('http://localhost:5000/api/v1/direct_messages',
    {data: {dm_channel: { user_id }}}
  )
);

export const fetchChannel = id => (
  Axios.get(`http://localhost:5000/api/v1/channels/${id}`)
);

export const deleteChannel = id => (
  Axios.delete(`http://localhost:5000/api/v1/channels/${id}`)
);

export const deleteDmChannel = id => (
  Axios.delete(`http://localhost:5000/api/v1/dm_channel_memberships/${id}`)
);

export const fetchChannels = (server_id) => (
  Axios.get('http://localhost:5000/api/v1/channels',
    {data: { channel: {server_id} }}
  )
);

export const fetchDmChannels = () => (
  Axios.get('http://localhost:5000/api/v1/dm_channel_memberships')
);

