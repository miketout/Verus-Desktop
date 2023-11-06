const { checkTimestamp } = require('agama-wallet-lib/src/time');
const { requestJson } = require('../../../utils/request/request');

let btcFees = {
  recommended: {},
  lastUpdated: null,
};

const BTC_FEES_MIN_ELAPSED_TIME = 120;

module.exports = (api) => {
  api.networkFees['BTC'] = () => {
    return new Promise(async (resolve, reject) => {
      if (checkTimestamp(btcFees.lastUpdated) > BTC_FEES_MIN_ELAPSED_TIME) {
        try {
          const res = await requestJson(
            "GET",
            "https://api.blockchain.com/mempool/fees"
          );

          const { priority, regular } = res;
          resolve({low: regular, mid: regular, max: priority});
        } catch(e) {
          reject(e)
        }
      } else {
        resolve(btcFees)
      }
    });
  }

  return api;
};