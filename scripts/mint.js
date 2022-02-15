const hre = require("hardhat");

async function main() {
  const NFT = await hre.ethers.getContractFactory("OfferWall");
  const { CONTRACT_ADDRESS } = process.env;
  const contract = NFT.attach(CONTRACT_ADDRESS);
  console.log(await contract.claim(2));
}
main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});