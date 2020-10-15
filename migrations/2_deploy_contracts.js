var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var RUP = artifacts.require("./RUP.sol");
var User = artifacts.require("./User.sol");
var MachuPicchu = artifacts.require("./MachuPicchu.sol");
var SendOTP = artifacts.require("./SendOTP.sol");
var OTPGeneratorAndVerifier = artifacts.require(
  "./OTPGeneratorAndVerifier.sol"
);

module.exports = function (deployer) {
  deployer.deploy(SendOTP).then(function () {
    return deployer
      .deploy(OTPGeneratorAndVerifier, SendOTP.address)
      .then(function () {
        return deployer.deploy(RUP).then(function () {
          return deployer.deploy(User, RUP.address).then(function () {
            return deployer.deploy(
              MachuPicchu,
              User.address,
              RUP.address,
              OTPGeneratorAndVerifier.address
            );
          });
        });
      });
  });
};
