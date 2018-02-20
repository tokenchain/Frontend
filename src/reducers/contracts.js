import {RATE_CONTRACT } from '../actions/contracts';
import { PAY_OFFER } from '../actions/offers';
import { makeId } from '../generic/util';
import { UPDATE_DASHBOARD } from '../actions/dashboard';
import { CONTRACT_STATE_VERIFIED, CONTRACT_STATE_FINISHED, CONTRACT_STATE_HALTED } from '../constants';
import { getUser } from '../demoData/ratings';

export default function(state = {current: [], finished: []}, action) {
  switch(action.type) {
    case RATE_CONTRACT:
      const feedback = action.feedback;
      const contract = state.finished.find(c => c._id === feedback.offerId);
      const user = getUser('my_profile');
      const f = {
        author: user._id,
        authorName: 'my_profile',
        dt: Date.now(),
        text: feedback.text,
        rate: feedback.rate,
      };
      const updated = {...contract, feedbacks: contract.feedbacks.concat(f)};
      return {...state, finished: state.finished.map(c => c._id === updated._id ? updated : c)};
    case PAY_OFFER: {
      const offer = action.offer;
      const contract = {
        ...offer,
        start: Math.floor(Date.now() / 1000),
        state: CONTRACT_STATE_VERIFIED,
        targetBalance: (offer.roi + 100) / 100 * offer.startBalance,
      };
      return {...state, current: state.current.concat(contract)};
    }
    case UPDATE_DASHBOARD: {
      const offers = [...action.data.offers.incoming, ...action.data.offers.outgoing];
      const current = offers.filter(o => o.state === CONTRACT_STATE_VERIFIED);
      const finished = offers.filter(o => o.state === CONTRACT_STATE_HALTED || o.state === CONTRACT_STATE_FINISHED);
      return {current, finished};
    }
    default:
      return state;
  }
}
