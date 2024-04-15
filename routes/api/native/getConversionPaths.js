module.exports = (api) => {
  api.native.get_conversion_paths = (
    chain,
    src
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const chainCurrency = await api.native.get_currency(chain, chain);

        const interface = await api.native.getRpcInterface(chain, chainCurrency.currencyid);
        const source = typeof src === "string" ? await api.native.get_currency(chain, src) : src;
        
        const paths = await interface.getCurrencyConversionPaths(source);

        delete paths[source.currencyid]

        resolve(paths);
      } catch(e) {
        reject(e)
      }
    });
  };

  api.setPost('/native/get_conversion_paths', (req, res, next) => {
    const coin = req.body.chainTicker;
    const src = req.body.src;

    api.native.get_conversion_paths(coin, src)
    .then((paths) => {  
      res.send(JSON.stringify({
        msg: 'success',
        result: paths,
      }));  
    })
    .catch(error => {
      const retObj = {
        msg: 'error',
        result: error.message,
      };
  
      res.send(JSON.stringify(retObj));  
    })
  });

  return api;
};