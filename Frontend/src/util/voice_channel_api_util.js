import Axios from 'axios';

export const createVoiceChannel = audio_channel => (
  Axios.post('localhost:1337/api/audio_channels',
    {data: { audio_channel }}
  )
);

export const fetchVoiceChannel = id => (
  Axios.get(`localhost:1337/api/audio_channels/${id}`)
);

export const deleteVoiceChannel = id => (
  Axios.delete(`localhost:1337/api/audio_channels/${id}`)
);

export const fetchVoiceChannels = (server_id) => (
  Axios.get('localhost:1337/api/audio_channels',
    {data: { audio_channel: { server_id } }}
  )
);
