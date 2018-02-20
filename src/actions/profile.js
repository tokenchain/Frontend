import { apiPut, apiGet, ApiError } from '../generic/apiCall';
import { getUser } from '../demoData/ratings';
import { generateHistory } from '../demoData/trades';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const GET_PROFILE = 'GET_PROFILE';
export const TRADES_FOR_USER = 'TRADES_FOR_USER';

export function updateProfile(profile) {
  return dispatch => {
    const name = profile.name;
    delete profile.name;
    apiPut('/api/profile/' + name, null, profile)
      .then(() => dispatch({
        type: UPDATE_PROFILE,
        profile: profile,
      }));
  };
}

export function getProfile(name) {
  return dispatch => {
    apiGet(`/api/profile/${name}`)
      .then(() => {
        const profile = getUser(name);
        dispatch({
          type: GET_PROFILE,
          profile,
        });
        dispatch(getTradesForUser(name));
      })
      .catch(e => {
        if(e.apiErrorCode) {
          switch(e.apiErrorCode) {
            case ApiError.NOT_FOUND:
              alert('no such profile');
              break;
            default:
              console.log('unhandled api error', e.apiErrorCode);
          }
        } else {
          console.log(e);
        }
      });
  };
}

export function getTradesForUser(name) {
  return dispatch => {
    apiGet(`/api/tradesForUser/${name}`)
      .then(() => {
        let trades;
        try {
          trades = JSON.parse(window.localStorage.getItem(`history${name}`));
          if(!trades) {
            throw new Error();
          }
        } catch(e) {
          trades = {asTrader: generateHistory(), asInvestor: []};
          window.localStorage.setItem(`history${name}`, JSON.stringify(trades));
        }
        dispatch({
          type: TRADES_FOR_USER,
          name,
          trades,
        });
      });
  };
}
