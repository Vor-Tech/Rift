import Axios from 'axios';

export const login = user => (
  Axios.post('http://localhost:1337/api/session',{ data: { user } })
);

export const fetchCurrentUserData = () => (
  Axios.get('localhost:1337/api/users/data')
);

export const signup = user => (
  Axios.post('http://localhost:1337/api/users', {data: { user }})
);

export const logout = () => (
  Axios.delete('localhost:1337/api/session')
);

export const editUser = (formData) => (
  Axios.patch(`localhost:1337/api/users/${formData.get('user[id]')}`,
    {
      data: formData,
      contentType: false,
      processData: false
    }
  )
);