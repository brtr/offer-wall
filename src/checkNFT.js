require('dotenv').config();
const { SERVER_URL, APP_ID } = process.env;

const Moralis  = require('moralis/node');
const serverUrl = SERVER_URL;
const appId = APP_ID;
Moralis.start({ serverUrl, appId });

// node src/checkNFT.js "polygon" "0x5CaCCe1B2c65606175469bCD3E6F4fbe4D0fb63c" "0x938a6942bd09cfac1bc4b2420f581a90fb5d5775"
async function main() {
  const args = process.argv.slice(2);

  const CHAIN = args[0]
  const userAddress = args[1]
  const tokenAddress = args[2]

  const options = { chain: CHAIN, address: userAddress, token_address: tokenAddress};
  const nfts = await Moralis.Web3API.account.getNFTsForContract(options);
  console.log(nfts.result.length > 0);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});