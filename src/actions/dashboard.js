import { apiGet, ApiError } from '../generic/apiCall';
import defaultErrorHandler from '../generic/defaultErrorHandler';
export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD';

export function fetchDashboardData() {
  return dispatch => {
    apiGet('/api/dashboard')
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
}
