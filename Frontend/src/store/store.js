import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer from '../reducers/root_reducer';

const localConfigureStore = (preloadedState = {}) => (
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger)
  })
);

export default localConfigureStore ;