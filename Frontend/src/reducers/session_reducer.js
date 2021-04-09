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
  console.log("Session Reducer state:",state);
  console.log("Session Reducer action:",action);
  switch (action.type) {
    // case RECEIVE_CURRENT_USER_DATA:
    //   return { id: action.currentUserData.currentUserId }; //this is the problem
    case RECEIVE_CURRENT_USER:
      return { id: action.currentUser.data.user.id };
    case LOGOUT_CURRENT_USER:
      return _nullUser;
    default:
      return state;
  }
};

export default sessionReducer;
