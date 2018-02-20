import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './rootReducer';
import thunk from 'redux-thunk';
import generateData from './demoData';

const DEMO_VERSION = '1';

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
    state = generateData();
    state.selectedNet = selectedNet;
    localStorage.setItem('demoVersion', DEMO_VERSION);
    saveState(state);
    return state;
  }
}


function saveState(state) {
  localStorage.setItem('reduxStateDemo', JSON.stringify(state));
  localStorage.setItem('demoDataLastUpdated', Date.now());
}
