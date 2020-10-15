const path = require("path");
var HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 7545,
    },
    kovan: {
      provider: new HDWalletProvider(
        "abuse culture whale flight narrow panther garage sail crime snack custom you",
        "https://kovan.infura.io/v3/50c1b6482c9f47b08dcab7b1500f5e24"
      ),
      network_id: 42,
      // networkCheckTimeout: 10
      gas: 4500000,
      gasPrice: 10000000000,
    },
  },
  compilers: {
    solc: {
      version: "^0.6.6", // A version or constraint - Ex. "^0.5.0"
      // Can also be set to "native" to use a native solc
      // settings: {
      //   optimizer: {
      //     enabled: <boolean>,
      //     runs: <number>   // Optimize for how many times you intend to run the code
      //   },
      //   evmVersion: <string> // Default: "petersburg"
      // }
    },
  },
};
