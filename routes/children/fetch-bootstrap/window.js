const { dialog } = require('electron')

async function canFetchBootstrap(chainTicker) {
  const supportedChains = [
      'VRSC',
      'VRSCTEST',
      'VARRR',
      'VDEX',
      'CHIPS'
  ];
  return supportedChains.includes(chainTicker)
    ? (
        await dialog.showMessageBox({
          type: "question",
          title: `Bootstrap ${chainTicker}?`,
          message: `Would you like to speed up syncing to the ${chainTicker} blockchain by downloading blockchain data from the internet?`,
          buttons: ["Yes", "No"],
        })
      ).response === 0
    : false;
}

module.exports = {
	canFetchBootstrap,
}