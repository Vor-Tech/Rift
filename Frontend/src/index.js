import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';

export default document.addEventListener('DOMContentLoaded', () => {
  let store;
  if (window.currentUser) {
    const preloadedState = {
      session: { id: window.currentUser.id },
      entities: {
        users: { [window.currentUser.id]: window.currentUser }
      }
    };
    store = configureStore({
      preloadedState,
      reducer: {
        session: (state) => {
          console.log('Returning State')
          return state
        },
        entities: (state) => state
      }
    })
    delete window.currentUser;
  } else {
    const preloadedState = {
      session: {},
      entities: {
        users: {}
      }
    }
    
    store = configureStore({
      preloadedState,
      reducer: {
        session: (state) => {
          console.log('this is working')
          return state
        },
        entities: (state) => state
      }
    })
  }
  
  const root = document.getElementById('root');
  ReactDOM.render(<Root store={store} />, root);
});