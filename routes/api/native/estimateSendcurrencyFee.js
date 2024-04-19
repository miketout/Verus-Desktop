module.exports = (api) => {
  api.native.estimate_sendcurrency_fee = async (chain, _params, minconfs = 1, sendfee = 0.0001) => {
    try {
      let feecurrency;
      
      const vETH = await api.native.get_currency(chain, 'vETH');

      // These are throwaway addresses, without any funds, to ensure this 
      // tx would fail if it were to be broadcasted, or at least not spend 
      // any user funds in the absolute worst case scenario.
      const raddr = "RGM3raQ1McqQYZpFyuBrqUpLnmgK7h8k4A"
      const address = _params.exportto === vETH.currencyid ? 
        "0xd62971620094e8244F1ed3B12a8D31bC969081fA" 
        : 
        raddr;

      const params = {..._params, amount: 0, address};

      const res = await api.native.callDaemon(chain, 'sendcurrency', [raddr, [params], minconfs, sendfee, true]);

      if (params.feecurrency == null) {
        const chainCurrency = await api.native.get_currency(chain, chain);
        feecurrency = chainCurrency.currencyid;
      } else feecurrency = params.feecurrency;

      return res.outputtotals[feecurrency];
    } catch(e) {
      throw e
    }
  };

  api.setPost('/native/estimate_sendcurrency_fee', async (req, res, next) => {
    const { chainTicker, params, minconfs, sendfee } = req.body;

    try {
      const retObj = {
        msg: 'success',
        result: await api.native.estimate_sendcurrency_fee(chainTicker, params, minconfs, sendfee),
      };
  
      res.send(JSON.stringify(retObj));  
    } catch(e) {
      const retObj = {
        msg: 'error',
        result: e.message,
      };
  
      res.send(JSON.stringify(retObj)); 
    }
  });
 
  return api;
};