import Axios from 'axios';

export const createServer = formData => (
  Axios.post('localhost:1337/api/servers',
  {
    data: formData,
    contentType: false,
    processData: false
  })
);

export const fetchServer = id => (
  Axios.get(`localhost:1337/api/servers/${id}`)
);

export const fetchMembers = id => (
  Axios.get(`localhost:1337/api/servers/${id}/members`)
);

export const fetchServers = () => (
  Axios.get('localhost:1337/api/servers')
);

export const joinServer = server => (
  Axios.post(`localhost:1337/api/servers/join`,
    {data: { server }}
  )
);

export const deleteServer = id => (
  Axios.delete(`localhost:1337/api/servers/${id}`)
);