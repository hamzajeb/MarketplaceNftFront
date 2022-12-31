require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/SmartContract/artifacts",
    sources: "./src/SmartContract/contracts",
    cache: "./src/SmartContract/cache",
    tests: "./src/SmartContract/test"
  },
};
