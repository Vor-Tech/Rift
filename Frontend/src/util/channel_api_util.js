import Axios from 'axios';

export const createChannel = channel => (
  Axios({
    method: 'POST',
    url: '/api/v1/channels',
    data: { channel }
  })
);

export const createDmChannel = user_id => (
  Axios({
    method: 'POST',
    url: '/api/v1/dm_channel_memberships',
    data: {dm_channel: { user_id }}
  })
);

export const fetchChannel = id => (
  Axios({
    method: 'GET',
    url: `/api/v1/channels/${id}`,
  })
);

export const deleteChannel = id => (
  Axios({
    method: 'DELETE',
    url: `/api/v1/channels/${id}`,
  })
);

export const deleteDmChannel = id => (
  Axios({
    method: 'DELETE',
    url: `/api/v1/dm_channel_memberships/${id}`,
  })
);

export const fetchChannels = (server_id) => (
  Axios({
    method: 'GET',
    url: '/api/v1/channels',
    data: { channel: {server_id} }
  })
);

export const fetchDmChannels = () => (
  Axios({
    method: 'GET',
    url: '/api/v1/dm_channel_memberships',
  })
);

