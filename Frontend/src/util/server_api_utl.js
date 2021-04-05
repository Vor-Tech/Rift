import Axios from 'axios';

export const createServer = formData => (
  Axios.post('localhost:5000/api/v1/servers',
  {
    data: formData,
    contentType: false,
    processData: false
  })
);

export const fetchServer = id => (
  Axios.get(`localhost:5000/api/v1/servers/${id}`)
);

export const fetchMembers = id => (
  Axios.get(`localhost:5000/api/v1/servers/${id}/members`)
);

export const fetchServers = () => (
  Axios.get('localhost:5000/api/v1/servers')
);

export const joinServer = server => (
  Axios.post(`localhost:5000/api/v1/servers/join`,
    {data: { server }}
  )
);

export const deleteServer = id => (
  Axios.delete(`localhost:5000/api/v1/servers/${id}`)
);