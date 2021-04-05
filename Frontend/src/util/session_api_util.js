import Axios from 'axios';

export const login = user => (
  Axios.post('http://localhost:5000/api/v1/session',{ data: { user } })
);

export const fetchCurrentUserData = () => (
  Axios.get('localhost:5000/api/v1/users/data')
);

export const signup = user => (
  Axios.post('http://localhost:5000/api/v1/users', {data: { user }})
);

export const logout = () => (
  Axios.delete('localhost:5000/api/v1/session')
);

export const editUser = (formData) => (
  Axios.patch(`localhost:5000/api/v1/users/${formData.get('user[id]')}`,
    {
      data: formData,
      contentType: false,
      processData: false
    }
  )
);