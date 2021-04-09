import Axios from "axios";

export const createFriendRequest = friend_request => (
  Axios.post('http://localhost:5000/api/v1/friend_requests',
    {data: { friend_request }}
  )
);

export const acceptFriendRequest = friend_request => (
  Axios.patch(`http://localhost:5000/api/v1/friend_requests/${friend_request.id}`)
);

export const deleteFriendRequest = friend_request => (
  Axios.delete(`http://localhost:5000/api/v1/friend_requests/${friend_request.id}`)
);

export const fetchFriendRequests = () => (
  Axios.get('http://localhost:5000/api/v1/friend_requests')
);

export const deleteFriend = id => (
  Axios.delete(`http://localhost:5000/api/v1/friends/${id}`)
);

export const fetchFriends = () => (
  Axios.get('http://localhost:5000/api/v1/friends')
);