const { LoginConsentProvisioningResponse } = require("verus-typescript-primitives");
const { ROOT_SYSTEM_NAME } = require("../../../utils/constants/dev_options");

module.exports = (api) => {
  /**
   * Verifies a provisioning response
   * @param {LoginConsentProvisioningResponse} Response
   */
  api.native.verusid.provision.verify_id_provisioning_response = async (response) => {
    const provisioningResponse = new LoginConsentProvisioningResponse(response);
    
    // Convert the system id to the chain name.
    const currencyObject = await api.native.get_currency(
      ROOT_SYSTEM_NAME,
      response.system_id
    );
    const chainTicker = currencyObject.name.toUpperCase();

    const verified = await api.native.verify_hash(
      chainTicker,
      provisioningResponse.signing_id,
      provisioningResponse.decision.toSha256().toString('hex'),
      provisioningResponse.signature.signature
    );

    return verified ? { verified } : { verified, message: "Failed to verify signature" };
  };

  api.setPost("/native/verusid/provision/verify_id_provisioning_response", async (req, res, next) => {
    const { response } = req.body;

    try {
      res.send(
        JSON.stringify({
          msg: "success",
          result: await api.native.verusid.provision.verify_id_provisioning_response(response),
        })
      );
    } catch (e) {
      res.send(
        JSON.stringify({
          msg: "error",
          result: e.message,
        })
      );
    }
  });

  return api;
};
