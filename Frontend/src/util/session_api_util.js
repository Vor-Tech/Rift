import Axios from 'axios';

export const login = user => (
  Axios({
    method: 'POST',
    url: 'localhost:3000/api/session',
    data: { user }
  })
);

export const fetchCurrentUserData = () => (
  Axios({
    method: 'GET',
    url: 'localhost:3000/api/users/data',
  })
);

export const signup = user => (
  Axios({
    method: 'POST',
    url: 'localhost:3000/api/users',
    data: { user }
  })
);

export const logout = () => (
  Axios({
    method: 'DELETE',
    url: 'localhost:3000/api/session'
  })
);

export const editUser = (formData) => (
  Axios({
    url: `localhost:3000/api/users/${formData.get('user[id]')}`,
    method: 'PATCH',
    data: formData,
    contentType: false,
    processData: false
  })
);