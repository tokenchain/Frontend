import { getRandom } from './util';
import * as random from '../generic/random';
import  rates from './rates';
function generateTrade(tx, count, dt) {
  let date = '';
  if(count < 32) {
    date = (new Date(dt.getTime() + count * 24 * 60 * 60 * 1000)).toISOString();
  } else {
    date = (new Date(dt.getTime() +  (count - 31) * 60 * 60 * 1000 +  31 * 24 * 60 * 60 * 1000)).toISOString();
  }

  const type = getRandomTradeType();
  const amountCurrency = getRandomCurrency();
  const fixedPrice = rates.BTC[amountCurrency];
  const percent = ((Math.random() * 2 - 1) / 10 + 1);
  const price = parseFloat((fixedPrice * percent).toFixed(8));
  const amount = parseFloat(((Math.random() * 2 + 0.01) / price).toFixed(2));
  const total = parseFloat((amount * price).toFixed(8));
  const usdtToBtcRate = rates.USDT['BTC'] * ((Math.random() * 2 - 1) / 2 + 1);
  return { price, date, type, amount, amountCurrency, total, tx, usdtToBtcRate: parseFloat(usdtToBtcRate.toFixed(2)) };
}

function gt() {
  const type = random.getOf(['sell', 'buy']);
  const main = random.getOf(['USDT', 'BTC', 'ETH']);
  const secondary = random.getOf(markets[main]);
  const market = main + '-' + secondary;
  const quantity = random.get(10, 100);
  let rate = rates[main][secondary];
  if(!rate) {
    return null;
  }
  rate = rate * random.get(0.90, 1.1);
  const filled = quantity;
  const closed = true;
  const imported = false;
  const dt = random.getInt(Date.now() - 86400000 * 20, Date.now());
  return {
    type,
    market,
    rate,
    quantity,
    filled,
    closed,
    imported,
    dt,
  };
}

export function generateHistory() {
  const history = [];
  while(history.length < 200) {
    const trade = gt();
    if(trade) {
      history.push(trade);
    }
  }
  return history;
}

function _generateTrade(tx, dt) {
  const date = dt;
  const type = getRandomTradeType();
  const amountCurrency = getRandomCurrency();
  const fixedPrice = rates.BTC[amountCurrency];
  const percent = ((Math.random() * 2 - 1) / 10 + 1);
  const price = parseFloat((fixedPrice * percent).toFixed(8));
  const amount = parseFloat(((Math.random() * 2 + 0.01) / price).toFixed(2));
  const total = parseFloat((amount * price).toFixed(8));
  const usdtToBtcRate = rates.USDT['BTC'] * ((Math.random() * 2 - 1) / 10 + 1);
  return { price, date, type, amount, amountCurrency, total, tx, usdtToBtcRate: parseFloat(usdtToBtcRate.toFixed(2)) };
}

function _generateTradesBlock(tx) {
  tx = tx || 'https://ropsten.etherscan.io/tx/0xf003ee3bdbd7c278864c2d4317669918e03b3dea7a0f5947051ea30c46e7c6f9';
  const yesterday = Date.now() - 86400000;
  const trades = [];
  for(let i = 0; i < 20; i++) {
    const date = yesterday + i * 86400000 / 24;
    trades.push(_generateTrade(tx, new Date(date)));
  }
  return trades;
}

function generateTradesBlock(n = 20, tx,count, lastYear) {
  tx = tx || 'https://ropsten.etherscan.io/tx/0xf003ee3bdbd7c278864c2d4317669918e03b3dea7a0f5947051ea30c46e7c6f9';
  const trades = [];
  const dayPoint = lastYear ? 2 : 0;
  const dateStart = new Date(Date.now() - ((n - count) * 31 * 24* 60 * 60 * 1000));
  for(let i = 1; i < 31 + dayPoint; i++) {
    trades.push(generateTrade(tx,i + 1, dateStart));
  }
  return trades;
}

function getRandomTradeType() {
  return Math.random() > 0.5 ? 'Sell' : 'Buy';
}

function getRandomPrice() {
  const random = Math.random() * 2 + 0.0001;
  const value = parseFloat(random.toFixed(5));
  return value;
}

const buyCurrencies = ['ETH', 'XRP', 'BCC', 'LTC'];
function getRandomCurrency() {
  return buyCurrencies[getRandom(buyCurrencies.length)];
}

export function generateTrades(numberOfBlock) {
  numberOfBlock = numberOfBlock || getRandom(4, 2);
  const trades = [];
  trades.push(_generateTradesBlock());
  for(let i = 0; i < 10; i++) {

    trades.push(generateTradesBlock(10, null, i, 9 == i ? true : false));
  }
  return trades;
}

const markets = {'USDT':['ADA','BCC','BTC','BTG','DASH','ETC','ETH','LTC','NEO','NXT','OMG','XMR','XRP','XVG','ZEC'],'ETH':['1ST','ADA','ADT','ADX','ANT','BAT','BCC','BCPT','BNT','BTG','CFI','CRB','CVC','DASH','DGB','DNT','ENG','ETC','FCT','GNO','GNT','GUP','HMQ','LGD','LTC','LUN','MANA','MCO','NEO','NMR','OMG','PAY','POWR','PTOY','QRL','QTUM','RCN','REP','RLC','SALT','SC','SNT','SRN','STORJ','STRAT','TIX','TRST','TRX','UKG','VEE','VIB','WAVES','WAX','WINGS','XEM','XLM','XMR','XRP','ZEC','ZRX'],'BTC':['1ST','2GIVE','ABY','ADA','ADT','ADX','AEON','AGRS','AMP','ANT','ARDR','ARK','AUR','BAT','BAY','BCC','BCPT','BCY','BITB','BLITZ','BLK','BLOCK','BNT','BRK','BRX','BSD','BTG','BURST','BYC','CANN','CFI','CLAM','CLOAK','CLUB','COVAL','CPC','CRB','CRW','CURE','CVC','DASH','DCR','DCT','DGB','DMD','DNT','DOGE','DOPE','DTB','DYN','EBST','EDG','EFL','EGC','EMC','EMC2','ENG','ENRG','ERC','ETC','ETH','EXCL','EXP','FAIR','FCT','FLDC','FLO','FTC','GAM','GAME','GBG','GBYTE','GCR','GEO','GLD','GNO','GNT','GOLOS','GRC','GRS','GUP','HMQ','IGNIS','INCNT','INFX','IOC','ION','IOP','KMD','KORE','LBC','LGD','LMC','LSK','LTC','LUN','MAID','MANA','MCO','MEME','MER','MLN','MONA','MUE','MUSIC','NAV','NBT','NEO','NEOS','NLG','NMR','NXC','NXS','NXT','OK','OMG','OMNI','PART','PAY','PDC','PINK','PIVX','PKB','POT','POWR','PPC','PTC','PTOY','QRL','QTUM','QWARK','RADS','RBY','RCN','RDD','REP','RLC','SALT','SBD','SC','SEQ','SHIFT','SIB','SLR','SLS','SNRG','SNT','SPHR','SPR','SRN','START','STEEM','STORJ','STRAT','SWIFT','SWT','SYNX','SYS','THC','TIX','TKS','TRST','TRUST','TRX','TX','UBQ','UKG','UNB','VEE','VIA','VIB','VOX','VRC','VRM','VTC','VTR','WAVES','WAX','WINGS','XCP','XDN','XEL','XEM','XLM','XMG','XMR','XMY','XRP','XST','XVC','XVG','XWC','XZC','ZCL','ZEC','ZEN','ZRX']};
