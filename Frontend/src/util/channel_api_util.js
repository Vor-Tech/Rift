import Axios from 'axios';

export const createChannel = channel => (
  Axios.post('localhost:1337/api/channels',
    {data: { channel }}
  )
);

export const createDmChannel = user_id => (
  Axios.post('localhost:1337/api/dm_channel_memberships',
    {data: {dm_channel: { user_id }}}
  )
);

export const fetchChannel = id => (
  Axios.get(`localhost:1337/api/channels/${id}`)
);

export const deleteChannel = id => (
  Axios.delete(`localhost:1337/api/channels/${id}`)
);

export const deleteDmChannel = id => (
  Axios.delete(`localhost:1337/api/dm_channel_memberships/${id}`)
);

export const fetchChannels = (server_id) => (
  Axios.get('localhost:1337/api/channels',
    {data: { channel: {server_id} }}
  )
);

export const fetchDmChannels = () => (
  Axios.get('localhost:1337/api/dm_channel_memberships')
);

