//This file merely configures the store for hot reloading.
//This boilerplate file is likely to be the same for each project that uses Redux.
//With Redux, the actual stores are in /reducers.

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  let store;
  if (window.devToolsExtension) { //Enable Redux devtools if the extension is installed in developer's browser
    store = window.devToolsExtension()(createStore)(rootReducer, initialState, applyMiddleware(thunkMiddleware));
  } else {
    store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
  }

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
