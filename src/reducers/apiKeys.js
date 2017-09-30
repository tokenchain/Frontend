import { DELETE_API_KEY, ADD_API_KEY, UPDATE_API_KEY } from '../actions/apiKeys';
// const KEYS = [
//   {keyName: 'Pending Key key', keyValue: 'Acx123123DFdf', stock: 'Some Stock', inUse: false, pairs: ['BTC-BCC'], owned: false, keyId: 1},
//   {keyName: 'Shared key', keyValue: 'Acx123123DFdf', stock: 'Some Stock', inUse: false, pairs: ['BTC-ETH'], owned: false, keyId: 2},
//   {keyName: 'My Key in use', keyValue: 'Acx12312sxdf', stock: 'Some Other Stock', inUse: true, pairs: ['BTC-ETH'], owned: true, keyId: 3},
//   {keyName: 'My Fee key', keyValue: 'Acx12312sxdf', stock: 'Some Other Stock', inUse: false, pairs: ['BTC-NEO'], owned: true, keyId: 4}
// ];
const KEYS = {ownKeys: [], receivedKeys: [], selected: null};

export default function(state = KEYS, action) {
  switch(action.type) {
    case DELETE_API_KEY: {
      const ownKeys = state.ownKeys.filter(apiKey => apiKey._id !== action.apiKey._id);
      return {...state, ownKeys};
    }
    case ADD_API_KEY: {
      const ownKeys = state.ownKeys.concat(action.apiKey);
      return {...state, ownKeys};
    }
    case UPDATE_API_KEY: {
      const ownKeys = state.ownKeys.map(apiKey => apiKey._id === action.apiKey._id ? action.apiKey : apiKey);
      return {...state, ownKeys};
    }
    default:
      return state;
  }
}
