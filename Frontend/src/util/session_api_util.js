import Axios from 'axios';

export const login = user => (
  Axios({
    method: 'POST',
    url: '/api/v1/session',
    data: { user }
  })
);

export const fetchCurrentUserData = () => (
  Axios({
    method: 'GET',
    url: '/api/v1/users/data',
  })
);

export const signup = user => (
  Axios({
    method: 'POST',
    url: '/api/v1/users',
    data: { user }
  })
);

export const logout = () => (
  Axios({
    method: 'DELETE',
    url: '/api/v1/session'
  })
);

export const editUser = (formData) => (
  Axios({
    url: `/api/v1/users/${formData.get('user[id]')}`,
    method: 'PATCH',
    data: formData,
    contentType: false,
    processData: false
  })
);