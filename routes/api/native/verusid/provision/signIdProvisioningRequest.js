const {
  ECPair,
  IdentitySignature,
  networks,
} = require("@bitgo/utxo-lib");
const { VerusIDSignature, IDENTITY_AUTH_SIG_VDXF_KEY } = require("verus-typescript-primitives");
const { ProvisioningRequest } = require("verus-typescript-primitives/dist/vdxf/classes/provisioning/ProvisioningRequest");

module.exports = (api) => {
  /**
   * Signs a provisioning request using an r-address.
   * 
   * @param {String} coin The chainTicker of the coin to make the call on
   * @param {String} request The provisioning request to sign
   * @param {String} raddress The raddress to sign the provioning requset with
   */
  api.native.verusid.provision.sign_id_provisioning_request = async (coin, request, raddress) => {

    const provisioningRequest = new ProvisioningRequest(request);

    const wif = await api.native.get_privkey(coin, raddress);
    const keyPair = ECPair.fromWIF(wif, networks.verus);

    const sig = new IdentitySignature(networks.verus);
    const base64Sig = sig.signHashOffline(provisioningRequest.getChallengeHash(), keyPair).toString("base64");
    
    provisioningRequest.signature = new VerusIDSignature(
      { signature: base64Sig },
      IDENTITY_AUTH_SIG_VDXF_KEY
    );

    return provisioningRequest;
  }

  api.setPost('/native/verusid/provision/sign_id_provisioning_request', async (req, res, next) => {
    const {
      chainTicker,
      request,
      raddress
    } = req.body;

    try {
      res.send(
        JSON.stringify({
          msg: "success",
          result: await api.native.verusid.provision.sign_id_provisioning_request(chainTicker, request, raddress),
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
}