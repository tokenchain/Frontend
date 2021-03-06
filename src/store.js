import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './rootReducer';
import thunk from 'redux-thunk';
import socketMiddleware from './socket_middleware';
import apiMiddleware from './apiMiddleware';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  getReduxState(),
  composeEnhancers(
    applyMiddleware(thunk, socketMiddleware, apiMiddleware),
  )
);
export default store;

export function getInitialState() {
  return {
    apiKeys: {
      ownKeys: [],
      receivedKeys: []
    },
    contracts: {
      current: [],
      finished: []
    },
    offers: {
      outgoing: [],
      incoming: []
    },
    auth: {
      loggedIn: false,
      profile: {
        contractSettings: {}
      }
    },
    ratings: [],
    exchanges: [],
    time: null,
    request: {},
    terminal: {
      fund: null,
      exchange: localStorage.getItem('terminal.selectedExchange') || 'binance',
      market: localStorage.getItem('terminal.selectedMarket') || 'USDT-BTC',
      interval: localStorage.getItem('terminal.selectedInterval') || '30 MIN',
      orderBook: {sell: [], buy: [], smap: {}, bmap: {}},
      history: [],
      ticker: null,
      orders: {open: [], closed: []},
    },
    rates: null,
    profile: {
      contractSettings: {},
      feedbacks: [],
      trades: []
    },
    exchangesInfo: {

    },
  };
}

function getReduxState() {
  let state = localStorage.getItem('reduxState');
  if(state) {
    state = {...getInitialState(), ...JSON.parse(state)};
  } else {
    state = getInitialState();
  }
  return state;
}
