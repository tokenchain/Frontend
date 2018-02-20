const exchanges = [
  {
    _id:'59ce97ba85a9febde71fbf7d',
    name:'bittrex',
    currencies: [
      'USDT', 'BTC', 'ETH',
      'LTC', 'DOGE', 'VTC', 'PPC', 'FTC', 'RDD', 'NXT', 'DASH', 'POT', 'BLK', 'EMC2',
      'XMY', 'AUR', 'EFL', 'GLD', 'SLR', 'PTC', 'GRS', 'NLG', 'RBY', 'XWC',
      'MONA', 'THC', 'ENRG', 'ERC', 'VRC', 'CURE', 'XMR', 'CLOAK', 'START', 'KORE',
      'XDN', 'TRUST', 'NAV', 'XST', 'VIA', 'PINK', 'IOC', 'CANN', 'SYS', 'NEOS',
      'DGB', 'BURST', 'EXCL', 'SWIFT', 'DOPE', 'BLOCK', 'ABY', 'BYC', 'XMG', 'BLITZ',
      'BAY', 'FAIR', 'SPR', 'VTR', 'XRP', 'GAME', 'COVAL', 'NXS', 'XCP', 'BITB',
      'GEO', 'FLDC', 'GRC', 'FLO', 'NBT', 'MUE', 'XEM', 'CLAM', 'DMD', 'GAM',
      'SPHR', 'OK', 'SNRG', 'PKB', 'CPC', 'AEON', 'GCR', 'TX', 'BCY',
      'EXP', 'INFX', 'OMNI', 'AMP', 'AGRS', 'XLM', 'CLUB', 'VOX', 'EMC',
      'FCT', 'MAID', 'EGC', 'SLS', 'RADS', 'DCR', 'BSD', 'XVG', 'PIVX', 'XVC',
      'MEME', 'STEEM', '2GIVE', 'LSK', 'PDC', 'BRK', 'WAVES', 'LBC', 'SBD', 'BRX',
      'ETC', 'STRAT', 'UNB', 'SYNX', 'EBST', 'VRM', 'SEQ', 'REP', 'SHIFT', 'ARDR',
      'XZC', 'NEO', 'ZEC', 'ZCL', 'IOP', 'GOLOS', 'UBQ', 'KMD', 'GBG', 'SIB',
      'ION', 'LMC', 'QWARK', 'CRW', 'SWT', 'MLN', 'ARK', 'DYN', 'TKS', 'MUSIC',
      'DTB', 'INCNT', 'GBYTE', 'GNT', 'NXC', 'EDG', 'LGD', 'TRST', 'WINGS', 'RLC',
      'GNO', 'GUP', 'LUN', 'HMQ', 'ANT', 'SC', 'BAT', 'ZEN', '1ST', 'QRL',
      'CRB', 'PTOY', 'CFI', 'BNT', 'NMR', 'SNT', 'DCT', 'XEL', 'MCO', 'ADT',
      'PAY', 'STORJ', 'ADX', 'OMG', 'CVC', 'PART', 'QTUM', 'BCC', 'DNT', 'ADA',
      'MANA', 'SALT', 'TIX', 'RCN', 'VIB', 'MER', 'POWR', 'BTG', 'ENG', 'UKG',
      'IGNIS', 'SRN', 'WAX', 'ZRX', 'VEE', 'BCPT', 'TRX'
    ]
  }
];

export function getRandomExchange() {
  const random = Math.floor(Math.random() * exchanges.length);
  return exchanges[random];
}

export default exchanges;
