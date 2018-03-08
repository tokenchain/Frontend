import * as random from '../generic/random';
import { CONTRACT_STATE_INIT, CONTRACT_STATE_ACCEPTED } from '../constants';
import { calculateKeyBalance } from '../generic/util';

export function generateOffer(key, state, from, to, rates) {
  const currency = random.getOf(['USDT', 'BTC', 'ETH']);
  const date = new Date(random.getInt(Date.now() -  86400000, Date.now()));
  const maxLoss = random.getInt(10, 25);
  const fee = random.getInt(10, 30);
  const duration = random.getInt(10, 30);
  const roi = random.getInt(10, 20);
  let startBalance;
  if(state === CONTRACT_STATE_ACCEPTED) {
    startBalance = getStartBalance(key, currency, rates);
  }
  return {_id: random.getId(), keyId: key._id, state, date, currency,
    fee, maxLoss, fromUser: [{name: from}], toUser: [{name: to}],
    duration, roi, startBalance,
  };
}

export function getRandomState() {
  return (Math.floor(Math.random() * 2) ? CONTRACT_STATE_INIT : CONTRACT_STATE_ACCEPTED);
}

function getStartBalance(key, currency, rates) {
  const balance = calculateKeyBalance(key, currency, rates);
  return Math.floor(balance * 100000000);
}
