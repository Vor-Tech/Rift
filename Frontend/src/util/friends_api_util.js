import Axios from "axios";

export const createFriendRequest = friend_request => (
  Axios({
    method: 'POST',
    url: '/api/v1/friend_requests',
    data: { friend_request }
  })
);

export const acceptFriendRequest = friend_request => (
  Axios({
    method: 'PATCH',
    url: `/api/v1/friend_requests/${friend_request.id}`,
  })
);

export const deleteFriendRequest = friend_request => (
  Axios({
    method: 'DELETE',
    url: `/api/v1/friend_requests/${friend_request.id}`,
  })
);

export const fetchFriendRequests = () => (
  Axios({
    method: 'GET',
    url: '/api/v1/friend_requests',
  })
);

export const deleteFriend = id => (
  Axios({
    method: 'DELETE',
    url: `/api/v1/friends/${id}`,
  })
);

export const fetchFriends = () => (
  Axios({
    method: 'GET',
    url: '/api/v1/friends',
  })
);