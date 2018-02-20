import words from '../demoData/words';
import names from '../demoData/names';

export function getMainCurrency() {
  const value = Math.random();
  if(value > 0.66) {
    return 'BTC';
  } else if(value > 0.33) {
    return 'USDT';
  } else {
    return 'ETH';
  }
}

export function getInt(from, to) {
  return Math.floor(Math.random() * (to - from) + from);
}

export function getBoolean() {
  return Math.random() > 0.5;
}

export function get(from, to) {
  const delta = to - from;
  return Math.random() * delta + from;
}

export function getId() {
  return getHexString(24);
};

export function getAddress() {
  return '0x' + getHexString(40);
}

function getHexString(length) {
  let text = '';
  let possible = 'abcdef0123456789';
  for (let i = 0; i < 24; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

export function getName() {
  return words[Math.floor(Math.random() * words.length)] +
    names[Math.floor(Math.random() * names.length)];
}

export function getOf(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function chanceOf(percent) {
  return Math.random() < percent;
}
