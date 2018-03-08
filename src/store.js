import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './rootReducer';
import thunk from 'redux-thunk';
import generateData from './demoData';
import { getUser } from './demoData/ratings';

const DEMO_VERSION = '8';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  getReduxState(),
  composeEnhancers(
    applyMiddleware(thunk)
  )
);

store.subscribe(() => saveState(store.getState()));
export default store;



function getReduxState() {
  let state = localStorage.getItem('reduxStateDemo');
  let selectedNet = localStorage.getItem('selectedNet') || 'mainnet';
  try {
    state = JSON.parse(state);
  } catch(e) {}
  const lastUpdated = parseInt(localStorage.getItem('demoDataLastUpdated'), 10) || 0;
  const version = localStorage.getItem('demoVersion');
  if(state && version === DEMO_VERSION && Date.now() - lastUpdated < 10 * 60 * 1000) {
    return state;
  } else {
    localStorage.clear();
    localStorage.setItem('demoVersion', DEMO_VERSION);
    return undefined;
  }
}


function saveState(state) {
  localStorage.setItem('reduxStateDemo', JSON.stringify(state));
  localStorage.setItem('demoDataLastUpdated', Date.now());
}
