import merge from 'lodash/merge';
import { RECEIVE_CURRENT_USER, RECEIVE_CURRENT_USER_DATA, RECEIVE_USER } from '../../actions/session_actions';
import { RECEIVE_USERS, REMOVE_SERVER, RECEIVE_SERVER } from '../../actions/server_actions';
import { RECEIVE_FRIENDS } from '../../actions/friends_actions';

const usersReducer = (state = {}, action) => {
  Object.freeze(state);
  console.log(action)
  let newState;
  switch (action.type) {
    case RECEIVE_CURRENT_USER_DATA:
      return merge({}, state, action.currentUserData.users);
    case RECEIVE_CURRENT_USER:
      return merge({}, state, { [action.currentUser.data.user.id]: action.currentUser.data.user });
    case RECEIVE_USER:
      return merge({}, state, { [action.user.id]: action.user });
    case RECEIVE_USERS:
      return merge({}, state, action.users);
    case RECEIVE_FRIENDS:
      return merge({}, state, action.friendData.users);
    case REMOVE_SERVER:
      newState = merge({}, state);
      newState[action.userId].servers = newState[action.userId].servers.filter(serverId => {
        return serverId !== action.serverId;
      });

      return newState;
    case RECEIVE_SERVER:
      console.log(1234,state)
      newState = merge({}, state);
      if (!newState[action.server.data.owner_id].servers.includes(action.server.data.id)) {
        newState[action.server.data.owner_id].servers.push(action.server.data.id);
      } 

      return newState;
    default:
      return state;
  }
};

export default usersReducer;