import { apiPut, apiDelete, apiPost, ApiError } from '../generic/apiCall';
import { LOGGED_OUT } from '../actions/auth';
import { getId } from '../generic/random';
import { generateCurrencies } from '../demoData/apiKeys';
export const DELETE_API_KEY = 'DELETE_API_KEY';
export const ADD_API_KEY = 'ADD_API_KEY';
export const UPDATE_API_KEY = 'UPDATE_API_KEY';


export function deleteApiKey(key) {
  return dispatch => {
    apiDelete('/api/key/' + key._id)
      .then(() => dispatch({
        type: DELETE_API_KEY,
        apiKey: key,
      }))
      .catch(error => {
        if(error.apiErrorCode) {
          switch(error.apiErrorCode) {
            case ApiError.FORBIDDEN: {
              dispatch({
                type: LOGGED_OUT,
              });
              break;
            }
            default:
              console.log('unhandled api error', error.apiErrorCode);
          }
        } else {
          console.log('error deleting key', error);
        }
      });
  };
}


export function addApiKey(key) {
  return dispatch => {
    console.log(key);
    apiPost('/api/key', null, key)
      .then(json => {
        console.log(key);
        key._id = getId();
        key.currencies = generateCurrencies();
        console.log(key);
        dispatch({
          type: ADD_API_KEY,
          apiKey: key,
        });
      })
      .catch(error => {
        if(error.apiErrorCode) {
          switch(error.apiErrorCode) {
            case ApiError.WRONG_API_KEY:
              alert('Invalid API key');
              return;
            case ApiError.DUPLICATE_KEY:
              alert('This key is already used');
              return;
            default:
              console.log('unhandled api error', error.apiErrorCode);
          }
        }
      });
  };
}

export function updateApiKey(key) {
  return dispatch => {
    apiPut('/api/key/' + key._id, null, {currencies: key.currencies})
      .then(apiKey => {
        dispatch({
          type: UPDATE_API_KEY,
          apiKey,
        });
      })
      .catch(err => {
        console.log(err);
        console.log(err.apiErrorCode);
      });
  };
}
