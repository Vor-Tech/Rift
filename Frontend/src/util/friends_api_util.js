import Axios from "axios";

export const createFriendRequest = friend_request => (
  Axios({
    method: 'POST',
    url: 'localhost:1337/api/v1/friend_requests',
    data: { friend_request }
  })
);

export const acceptFriendRequest = friend_request => (
  Axios({
    method: 'PATCH',
    url: `localhost:1337/api/v1/friend_requests/${friend_request.id}`,
  })
);

export const deleteFriendRequest = friend_request => (
  Axios({
    method: 'DELETE',
    url: `localhost:1337/api/v1/friend_requests/${friend_request.id}`,
  })
);

export const fetchFriendRequests = () => (
  Axios({
    method: 'GET',
    url: 'localhost:1337/api/v1/friend_requests',
  })
);

export const deleteFriend = id => (
  Axios({
    method: 'DELETE',
    url: `localhost:1337/api/v1/friends/${id}`,
  })
);

export const fetchFriends = () => (
  Axios({
    method: 'GET',
    url: 'localhost:1337/api/v1/friends',
  })
);