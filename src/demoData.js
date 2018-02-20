import { generateKeys, KEY_STATE_USED } from './demoData/apiKeys';
import { generateId, generateTraderName } from './demoData/util';
import { generateOffer, getRandomState } from './demoData/offers';
import { generateContract } from './demoData/contracts';
import { getUser } from './demoData/ratings';
import { generateOrders } from './demoData/orders';
import { generateHistory } from './demoData/history';

import { CONTRACT_STATE_VERIFIED, CONTRACT_STATE_HALTED, CONTRACT_STATE_FINISHED } from './constants';




export default function generateData() {
  const profile = getUser('my_profile');
  const apiKeys = generateKeys(profile._id);
  const usedKeys = apiKeys.ownKeys.filter(k => k.state === KEY_STATE_USED);

  const outgoingOffers = [];
  for(let i = 0; i < usedKeys.length / 2; i++) {
    const offer = generateOffer(usedKeys[i]._id, getRandomState(), profile.name, generateTraderName());
    outgoingOffers.push(offer);
  }

  const myActiveContracts = [];
  for(let i = Math.floor(usedKeys.length / 2); i < usedKeys.length; i++) {
    const contract = generateContract(usedKeys[i]._id, CONTRACT_STATE_VERIFIED, generateTraderName());
    myActiveContracts.push(contract);
  }

  const incomingOffers = [];
  for(let i = 0; i < apiKeys.receivedKeys.length / 2; i++) {
    const offer = generateOffer(apiKeys.receivedKeys[i]._id, getRandomState(), generateTraderName(), profile.name);
    incomingOffers.push(offer);
  }
  const myContracts = [];
  for(let i = apiKeys.receivedKeys.length / 2; i < apiKeys.receivedKeys.length; i++) {
    const contract = generateContract(apiKeys.receivedKeys[i]._id, CONTRACT_STATE_VERIFIED, profile.name);;
    myContracts.push(contract);
  }

  const finishedContracts = [];

  for(let i = 0; i < 20; i++) {
    if(getRandom(2)) {
      const contract = generateContract(apiKeys.ownKeys[getRandom(apiKeys.ownKeys.length)]._id, getRandomFinishedContractState(), generateTraderName());
      finishedContracts.push(contract);
    } else {
      const contract = generateContract(generateId(), getRandomFinishedContractState(), profile.name);;
      finishedContracts.push(contract);
    }
  }
  return {
    auth: {loggedIn: true, profile},
    apiKeys,
    offers: {incoming: incomingOffers, outgoing: outgoingOffers},
    contracts: {current: myActiveContracts.concat(myContracts), finished: finishedContracts},
  };
}


function getRandomFinishedContractState() {
  return getPercent(80) ? CONTRACT_STATE_FINISHED : CONTRACT_STATE_HALTED;
}

function getRandom(n) {
  return Math.floor(Math.random() * n);
}

function getPercent(n) {
  return getRandom(101) < n;
}
