var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var MachuPicchu = artifacts.require("./MachuPicchu.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(MachuPicchu);
};
