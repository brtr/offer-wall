/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { API_URL, API_KEY, PRIVATE_KEY } = process.env;

module.exports = {
   solidity: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
   },
   defaultNetwork: "rinkeby",
   etherscan: {
      apiKey: API_KEY,
   },
   networks: {
      hardhat: {},
      rinkeby: {
         url: API_URL,
         accounts: [PRIVATE_KEY]
      }
   },
}


