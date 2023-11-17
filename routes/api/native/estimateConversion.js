module.exports = (api) => {
  /**
   * @param {string} chain
   * @param {{currency: string, amount: number, convertto: string, preconvert: boolean, via: string}} params
   */
  api.native.estimate_conversion = async (chain, params) => {
    try {
      return await api.native.callDaemon(chain, 'estimateconversion', [params]);
    } catch(e) {
      throw e
    }
  };

  api.setPost('/native/estimate_conversion', async (req, res, next) => {
    const { chainTicker, params } = req.body

    try {
      const retObj = {
        msg: 'success',
        result:  await api.native.estimate_conversion(chainTicker, params),
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