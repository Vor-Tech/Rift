import { RECEIVE_SERVER_ERRORS, RECEIVE_SERVER, REMOVE_SERVER_ERRORS } from '../../actions/server_actions';

export default (state = [], action) => {
  Object.freeze(state);
  console.log("Server Errors Reducer state:",state);
  console.log("Server Errors Reducer action:",action);
  switch (action.type) {
    case RECEIVE_SERVER_ERRORS:
      return action.errors;
    case RECEIVE_SERVER:
      return [];
    case REMOVE_SERVER_ERRORS:
      return [];
    default:
      return state;
  }
};