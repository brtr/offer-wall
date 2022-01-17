require('dotenv').config();
const { SERVER_URL, APP_ID } = process.env;

const Moralis  = require('moralis/node');
const serverUrl = SERVER_URL;
const appId = APP_ID;
Moralis.start({ serverUrl, appId });

const CHAIN = ""
const userAddress = ""
const tokenAddress = ""

async function main() {
  const options = { chain: CHAIN, address: userAddress, token_address: tokenAddress};
  const nfts = await Moralis.Web3API.account.getNFTsForContract(options);
  console.log(nfts.result.length > 0);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});