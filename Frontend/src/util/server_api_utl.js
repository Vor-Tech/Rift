import Axios from 'axios';

export const createServer = (formData) => (
  Axios.post('http://localhost:5000/api/v1/guilds',
  {
    data: formData,
    contentType: false,
    processData: false
  })
);

export const fetchServer = id => (
  Axios.get(`http://localhost:5000/api/v1/guilds/${id}`)
);

export const fetchMembers = id => (
  Axios.get(`http://localhost:5000/api/v1/guilds/${id}/members`)
);

export const fetchServers = () => (
  Axios.get('http://localhost:5000/api/v1/guilds')
);

export const joinServer = server => (
  Axios.post(`http://localhost:5000/api/v1/guilds/join`,
    {data: { server }}
  )
);

export const deleteServer = id => (
  Axios.delete(`http://localhost:5000/api/v1/guilds/${id}`)
);