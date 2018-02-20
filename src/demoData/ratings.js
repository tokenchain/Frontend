import * as random from '../generic/random';
import { generateFeedbacks, generateCurrencies } from './profile';

export function generateRatings() {
  const ratings = [];
  for(let i = 0; i < 50; i++) {
    const user = generateUser();
    user.rank = i + 1;
    ratings.push(user);
  }
  return ratings;
}

export function getRatings() {
  try {
    let ratings = JSON.parse(window.localStorage.getItem('demoRatings'));
    if(Array.isArray(ratings)) {
      return ratings;
    } else {
      throw new Error('should be array');
    }
  } catch(e) {
    const ratings = generateRatings();
    window.localStorage.setItem('demoRatings', JSON.stringify(ratings));
    return ratings;
  }
}

export function getUser(name) {
  let ratings;
  try {
    ratings = JSON.parse(window.localStorage.getItem('demoRatings'));
    if(!Array.isArray(ratings)) {
      throw new Error('should be array');
    }
  } catch(e) {
    ratings = generateRatings();
    window.localStorage.setItem('demoRatings', JSON.stringify(ratings));
  }
  let user = ratings.find(u => u.name === name);
  if(!user) {
    user = generateUser(name);
    const maxRank = ratings.reduce((maxRank, user) => Math.max(maxRank, user.rank), 1);
    user.rank = maxRank + 1;
    ratings.push(user);
    window.localStorage.setItem('demoRatings', JSON.stringify(ratings));
  }
  if(user.feedbacks.length === 0) {
    user.feedbacks = generateFeedbacks();
    window.localStorage.setItem('demoRatings', JSON.stringify(ratings));
  }
  if(user.currencies.length === 0) {
    user.currencies = generateCurrencies();
    window.localStorage.setItem('demoRatings', JSON.stringify(ratings));
  }
  return user;
}

function generateUser(userName) {
  const name = userName || random.getName();
  const availableForOffers = random.getBoolean();
  const fee = random.getInt(10, 25);
  const roi = random.getInt(10, 20);
  const dt = Date.now() - random.getInt(20, 200) * 86400000;
  const minAmountCurrency = random.getMainCurrency();
  const minAmount = getMinAmount(minAmountCurrency);
  const feedbacks = [];
  const inManagement = random.get(100, 10000);
  const _id = random.getId();
  const currencies = [];
  const duration = random.getInt(20, 60);
  const addr = random.getAddress();
  const maxLoss = random.getInt(10, 30);
  const roiInUSD = random.get(0, 40);
  const roiInBTC = random.get(0, 40);
  const totalContracts = random.getInt(1, 10);
  const successContracts = random.getInt(0, totalContracts);
  const paidExcessProfit = random.getInt(0, 1000);
  const paidInvoices = random.getInt(1, 1000);
  const rating = random.getInt(1, 5);
  return {
    _id, addr, name, dt,
    feedbacks, currencies, inManagement,
    availableForOffers, duration, minAmountCurrency, minAmount,
    roi, maxLoss, fee, roiInUSD, roiInBTC,
    totalContracts, successContracts,
    paidExcessProfit, paidInvoices, rating,
  };
}

function getMinAmount(currency) {
  switch(currency) {
    case 'BTC':
      return random.getInt(1, 10);
    case 'ETH':
      return random.getInt(10, 200);
    case 'USDT':
      return random.getInt(500, 10000);
    default:
      throw Error('invalid min amount currency');
  }
}

