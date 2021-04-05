import Axios from 'axios';

export const createVoiceChannel = audio_channel => (
  Axios.post('localhost:5000/api/v1/audio_channels',
    {data: { audio_channel }}
  )
);

export const fetchVoiceChannel = id => (
  Axios.get(`localhost:5000/api/v1/audio_channels/${id}`)
);

export const deleteVoiceChannel = id => (
  Axios.delete(`localhost:5000/api/v1/audio_channels/${id}`)
);

export const fetchVoiceChannels = (server_id) => (
  Axios.get('localhost:5000/api/v1/audio_channels',
    {data: { audio_channel: { server_id } }}
  )
);
