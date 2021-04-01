import Axios from 'axios';

export const createVoiceChannel = audio_channel => (
  Axios({
    method: 'POST',
    url: 'localhost:1337/api/audio_channels',
    data: { audio_channel }
  })
);

export const fetchVoiceChannel = id => (
  Axios({
    method: 'GET',
    url: `localhost:1337/api/audio_channels/${id}`,
  })
);

export const deleteVoiceChannel = id => (
  Axios({
    method: 'DELETE',
    url: `localhost:1337/api/audio_channels/${id}`,
  })
);

export const fetchVoiceChannels = (server_id) => (
  Axios({
    method: 'GET',
    url: 'localhost:1337/api/audio_channels',
    data: { audio_channel: { server_id } }
  })
);
