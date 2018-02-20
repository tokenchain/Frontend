import * as random from '../generic/random';
import { CONTRACT_STATE_INIT, CONTRACT_STATE_ACCEPTED } from '../constants';
export function generateOffer(keyId, state, from, to, keyBalance) {
  const currency = random.getOf(['USDT', 'BTC', 'ETH']);
  const date = new Date(random.getInt(Date.now() -  86400000, Date.now()));
  const maxLoss = random.getInt(10, 25);
  const fee = random.getInt(10, 30);
  const duration = random.getInt(10, 30);
  const roi = random.getInt(10, 20);
  let startBalance;
  if(state === CONTRACT_STATE_ACCEPTED) {
    startBalance = getStartBalance(currency);
  }
  return {_id: random.getId(), keyId, state, date, currency,
    fee, maxLoss, fromUser: [{name: from}], toUser: [{name: to}],
    duration, roi, startBalance,
  };
}

export function getRandomState() {
  return (Math.floor(Math.random() * 2) ? CONTRACT_STATE_INIT : CONTRACT_STATE_ACCEPTED);
}

function getStartBalance(currency) {
  switch(currency) {
    case 'USDT':
      return random.getInt(1000, 2000) * 100000000;
    case 'ETH':
      return random.getInt(20, 40) * 100000000;
    case 'BTC':
      return random.getInt(1, 10) * 100000000;
    default:
      return null;
  }
}
