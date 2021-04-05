import {
  RECEIVE_CURRENT_USER,
  LOGOUT_CURRENT_USER,
  RECEIVE_CURRENT_USER_DATA,
} from '../actions/session_actions';

const _nullUser = Object.freeze({
  id: null
});

const sessionReducer = (state = _nullUser, action) => {
  Object.freeze(state);
  console.log(1,action);
  console.log(2,state)
  switch (action.type) {
    case RECEIVE_CURRENT_USER_DATA:
      return { id: action.currentUserData.currentUserId };
    case RECEIVE_CURRENT_USER:
      return { id: action.currentUser.data.user.id };
    case LOGOUT_CURRENT_USER:
      return _nullUser;
    default:
      return state;
  }
};

export default sessionReducer;
