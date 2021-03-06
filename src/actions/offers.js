import { apiPost, ApiError } from '../generic/apiCall';
import defaultErrorHandler from '../generic/errorHandlers';
import { ABI, CONTRACT_ADDRESS, ETHEREUM_NET } from '../eth/MercatusFactory';

export const ACCEPT_OFFER = 'ACCEPT_OFFER';
export const REJECT_OFFER = 'REJECT_OFFER';
export const CANCEL_OFFER = 'CANCEL_OFFER';
export const SEND_OFFER = 'SEND_OFFER';
export const VERIFY_OFFER = 'VERIFY_OFFER';
export const PAY_OFFER = 'PAY_OFFER';
export const NEW_OFFER = 'NEW_OFFER';


export function acceptOffer(offer) {
  return dispatch => {
    apiPost(`/contract/${offer._id}/accept`)
      .then(offer => {
        dispatch({
          type: ACCEPT_OFFER,
          offer
        });
      });
  };
}

export function cancelOffer(offer) {
  return dispatch => {
    apiPost(`/contract/${offer._id}/cancel`)
      .then(offer => {
        dispatch({
          type: CANCEL_OFFER,
          offer
        });
      });
  };
}

export function rejectOffer(offer) {
  return dispatch => {
    apiPost(`/contract/${offer._id}/reject`)
      .then(offer => dispatch({
        type: REJECT_OFFER,
        offer
      }));
  };
}

export function sendOffer(offer) {
  return dispatch => {
    return apiPost('/contract', null, offer)
      .catch(err => {
        if(err.apiErrorCode) {
          switch(err.apiErrorCode) {
            case ApiError.WRONG_MIN_AMOUNT: {
              alert('Your api key balance is lower that trader\'s minmum contract amount');
              break;
            }
            case ApiError.WRONG_DEAL_TERMS:
              alert('Trader has changed contract settings, please reload page');
              break;
            case ApiError.INSUFFICIENT_FUNDS:
              alert('Error. Insufficient funds');
              break;
            case ApiError.TRADER_NOT_AVAILABLE:
              alert('Error. Trader not available');
              break;
            default:
              defaultErrorHandler(err, dispatch);
          }
        }
        console.log(err);
        console.log(err.apiErrorCode);
      });
  };
}

export function payOffer(offer) {
  return dispatch => {
    window.web3.version.getNetwork((err, code) => {
      if(err) {
        alert('web3 error: no network');
      } else {
        if(ETHEREUM_NET === 'mainnet' && code !== '1') {
          alert('Please select main net in Metamask');
        } else if(ETHEREUM_NET === 'testnet' && code !== '3') {
          alert('Please select Ropsten network in Metamask');
        } else {
          window.web3.eth.getAccounts((err, accs) => {
            if(err) {
              alert('Metamask error: cannot get account');
            } else {
              const account = accs[0];
              if(!account) {
                alert('Unlock metamask');
                return;
              }
              const address = CONTRACT_ADDRESS;
              sendTransaction(address, offer, ETHEREUM_NET);
            }
          });
        }
      }
    });
  };
}


function sendTransaction(address, offer, net) {
  const contract = window.web3.eth.contract(ABI).at(address);
  const {contractSettings: {duration, currency, maxLoss, amount, startBalance, targetBalance}, _id} = offer;
  const investor = offer.from.name;
  const investorAddress = offer.from.address;
  const trader = offer.to.name;
  const traderAddress = offer.to.address;
  let contractCurrency;
  switch(currency) {
    case 'ETH':
      contractCurrency = 2;
      break;
    case 'BTC':
      contractCurrency = 1;
      break;
    case 'USDT':
      contractCurrency = 0;
      break;
    default:
      alert(offer.currency + ' not supported for contract yet');
      return;
  }
  console.log(duration, maxLoss, startBalance, targetBalance, amount, investor, investorAddress, trader, traderAddress, '0x' + _id, contractCurrency);
  console.log({value: amount});
  contract.makeDeal(
    duration,
    maxLoss,
    startBalance,
    targetBalance,
    amount,
    investor,
    investorAddress,
    trader,
    traderAddress,
    '0x' + _id,
    contractCurrency,{value: amount},  (err, tx) => {
      if(err) {
        return;
      } else {
        let txUrl;
        switch(net) {
          case 'mainnet':
            txUrl = 'https://etherscan.io/tx/' + tx;
            break;
          case 'testnet':
            txUrl = 'https://ropsten.etherscan.io/tx/' + tx;
            break;
          default:
            throw new Error(`unkown selected net: ${net}`);
        }
        alert('You have sent transaction to pay this request.' +
          ' If transaction completes succesfully you will receive the contract.' +
          ' Check the transaction status in metamask or here: ' +
          txUrl + '\nDo not pay this request again, if the transaction has not completed yet');
      }
    });
}
