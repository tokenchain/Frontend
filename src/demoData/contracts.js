import { CONTRACT_STATE_FINISHED,
  CONTRACT_STATE_HALTED } from '../constants';
import * as random from '../generic/random';
import { calculateKeyBalance } from '../generic/util';

export const generateContract = (key, state, contractor, rates) => {
  const id = random.getId();
  const duration = random.getInt(10, 60);
  const fee = random.getInt(10, 25);
  const roi = random.getInt(10, 40);
  const maxLoss = random.getInt(10, 25);
  const currency = random.getOf(['USDT', 'BTC', 'ETH']);
  const startBalance = getStartBalance(key, currency, rates, maxLoss, roi);
  const targetBalance = Math.floor((100 + roi) / 100 * startBalance);
  const start = Math.floor(random.getInt(Date.now() - duration * 86400000, Date.now()) / 1000);
  let finishDate, finishBalance;
  if(state === CONTRACT_STATE_FINISHED || state === CONTRACT_STATE_HALTED) {
    finishDate = random.getInt(Date.now() - 86400000 * 100, Date.now() - 86400000 * 10);
  }
  let reason;
  if(state === CONTRACT_STATE_FINISHED && random.chanceOf(0.66)) {
    reason = 'targetBalance';
    finishBalance = targetBalance;
  } else {
    finishBalance = Math.floor((random.get(-maxLoss - 1, roi - 5) + 100) / 100 * startBalance);
  }
  return {contractor, duration,
    currency: currency,
    state, start, finishDate, finishBalance, reason,
    startBalance, targetBalance, roi,
    maxLoss, fee, feedbacks: [],
    toUser:[{name: contractor}],
    _id: id, keyId: key ?  key._id : random.getId()};
};

function getStartBalance(key, currency, rates, maxLoss, roi) {
  if(!key) {
    switch(currency) {
      case 'USDT':
        return Math.floor(random.get(1000, 5000) * 100000000);
      case 'ETH':
        return Math.floor(random.get(10, 50) * 100000000);
      case 'BTC':
        return Math.floor(random.get(1, 10) * 100000000);
      default:
        return;
    }
  }
  const discrepance = (random.get(-maxLoss + 4, roi - 5) + 100) / 100;
  const balance = calculateKeyBalance(key, currency, rates);
  return Math.floor(balance * 100000000 * discrepance);
}
