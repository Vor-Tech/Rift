import Axios from 'axios';

export const createServer = formData => (
  Axios({
    method: 'POST',
    url: 'localhost:1337/api/servers',
    data: formData,
    contentType: false,
    processData: false
  })
);

export const fetchServer = id => (
  Axios({
    method: 'GET',
    url: `localhost:1337/api/servers/${id}`,
  })
);

export const fetchMembers = id => (
  Axios({
    method: 'GET',
    url: `localhost:1337/api/servers/${id}/members`,
  })
);

export const fetchServers = () => (
  Axios({
    method: 'GET',
    url: 'localhost:1337/api/servers',
  })
);

export const joinServer = server => (
  Axios({
    method: 'POST',
    url: `localhost:1337/api/servers/join`,
    data: { server }
  })
);

export const deleteServer = id => (
  Axios({
    method: 'DELETE',
    url: `localhost:1337/api/servers/${id}`,
  })
);