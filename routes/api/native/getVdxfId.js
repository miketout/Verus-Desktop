module.exports = (api) => {
  /**
   * Returns the VDXF key of the URI string.
   * 
   * @param {String} coin The chainTicker of the coin to make the call on
   * @param {String} vdxfuri This message is converted from hex, the data is hashed, then returned
   * @param {Object} initialvdxfdata The optional data of (vdxfkey, uint256, indexnum) that is combined.
   */
  api.native.get_vdxf_id = (
    coin,
    vdxfuri,
    initialvdxfdata = {},
  ) => {
    return new Promise((resolve, reject) => {
      api.native
        .callDaemon(
          coin,
          "getvdxfid",
          [
            vdxfuri,
            initialvdxfdata
          ]
        )
      .then(resultObj => {
        resolve(resultObj)
      })
      .catch(err => {
        reject(err);
      });
    });
  };

  api.setPost('/native/get_vdxf_id', (req, res, next) => {
    const {
      chainTicker,
      vdxfuri,
      initialvdxfdata
    } = req.body;

    api.native
      .get_vdxf_id(
        chainTicker,
        vdxfuri,
        initialvdxfdata
      )
      .then(resultObj => {
        const retObj = {
          msg: "success",
          result: resultObj
        };

        res.send(JSON.stringify(retObj));
      })
      .catch(error => {
        const retObj = {
          msg: "error",
          result: error.message
        };

        res.send(JSON.stringify(retObj));
      });
  });

  return api;
}