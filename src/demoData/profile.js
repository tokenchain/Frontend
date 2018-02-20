import { generateId, generateTraderName, generateAddress, getRandom } from './util';
import validCurrencies from './validCurrencies';
import * as random from '../generic/random';

export const generateProfile = (profileName) => {
  const _id = generateId();
  const addr = generateAddress();
  const feedbacks = generateFeedbacks();
  const availableForOffers = Math.random() * 2 < 1;
  const fee = Math.floor(Math.random() * 10 + 10);
  const minAmount = Math.floor(Math.random() * 200 + 50);
  const minAmountCurrency = 'USDT';
  const roi = Math.floor(Math.random() * 10 + 5);
  const duration = Math.floor(Math.random() * 15 + 15);;
  const maxLoss = Math.floor(Math.random() * 10 + 10);
  const dt = Date.now() - Math.floor(Math.random() * 86400000 * 40 + 86400000);
  const name = profileName  || 'me';
  const currencies = [];
  const inManagement = Math.floor(Math.random() * 1000);
  return {
    _id, addr, feedbacks, availableForOffers,
    fee, minAmount, roi, minAmountCurrency, duration, maxLoss,
    dt, currencies, name, inManagement,
  };
};

const currency = name => {
  return {
    name,
    preferred: Math.random() * 2 < 1,
    roi: Math.floor(Math.random() * 20 - 10),
    tradeVolume: Math.floor(Math.random() * 500 + 50)
  };
};

export function generateCurrencies() {
  return validCurrencies.map(name => {
    return {
      name,
      preferred: random.getOf([true, false]),
      tradeVolume: random.get(10, 1000),
    };
  })
}

export function generateFeedbacks() {
  const feedbacks = [];
  const now = Date.now();
  for(let i = 0; i < 20; i++) {
    const feedback = {
      authorName: generateTraderName(),
      dt: random.getInt(now - 86400000 * 50, now),
      rate: getRandom(5) + 1,
      text: generateText(),
    };
    feedbacks.push(feedback);
  }
  return feedbacks;
}

function generateText() {
  const words = [];
  for(let i = 0; i < 20; i++) {
    words.push(dicitonary[getRandom(dicitonary.length)]);
  }
  return words.join(' ');
}

const dicitonary = [
  'currency', 'exchange', 'market', 'superiour', 'extra',
  'scum', 'excellent', 'important', 'money', 'money', 'trade', 'bitcoin',
  'promise', 'future'
];

