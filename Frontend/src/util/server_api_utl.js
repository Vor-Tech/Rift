import Axios from 'axios';

export const createServer = formData => (
  Axios({
    method: 'POST',
    url: '/api/v1/servers',
    data: formData,
    contentType: false,
    processData: false
  })
);

export const fetchServer = id => (
  Axios({
    method: 'GET',
    url: `/api/v1/servers/${id}`,
  })
);

export const fetchMembers = id => (
  Axios({
    method: 'GET',
    url: `/api/v1/servers/${id}/members`,
  })
);

export const fetchServers = () => (
  Axios({
    method: 'GET',
    url: '/api/v1/servers',
  })
);

export const joinServer = server => (
  Axios({
    method: 'POST',
    url: `/api/v1/servers/join`,
    data: { server }
  })
);

export const deleteServer = id => (
  Axios({
    method: 'DELETE',
    url: `/api/v1/servers/${id}`,
  })
);