import { apiGet } from '../generic/apiCall';
import exchanges from '../demoData/exchanges';
export const UPDATE_EXCHANGES = 'UPDATE_EXCHANGES';

export const updateExchanges = () => {
  return dispatch => {
    apiGet('/api/exchanges')
      .then(() => dispatch({
        type: UPDATE_EXCHANGES,
        exchanges,
      }));
  };
};
