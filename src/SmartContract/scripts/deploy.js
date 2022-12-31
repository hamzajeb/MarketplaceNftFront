const {ethers } = require("hardhat");
async function main() {

  const [deployer] = await ethers.getSigners();
  // A Signer in Ethers.js is an object that represents an Ethereum account. It's used to send transactions to
  //  contracts and other accounts. Here we're getting a list of the accounts in the node we're connected to,
  //   which in this case is Hardhat Network,and only keeping the first and second ones.
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contracts here:
  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  const MarketPlace = await ethers.getContractFactory("Marketplace");
  const marketPlace = await MarketPlace.deploy(1);//deploy(1) : beacause constructo accept one variable
  console.log("NFT Contract Address :", nft.address);
  console.log("MarketPlace Contract Address :", marketPlace.address);
  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(nft , "NFT");
  saveFrontendFiles(marketPlace , "Marketplace");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../../contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
