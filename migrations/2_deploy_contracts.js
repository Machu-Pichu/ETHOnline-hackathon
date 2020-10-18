var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var RUP = artifacts.require("./RUP.sol");
var User = artifacts.require("./User.sol");
var MachuPicchu = artifacts.require("./MachuPicchu.sol");
var SendOTP = artifacts.require("./SendOTP.sol");
var OTPGeneratorAndVerifier = artifacts.require(
  "./OTPGeneratorAndVerifier.sol"
);
var paymaster = artifacts.require("./MachuPicchuPaymentmaster.sol");

module.exports = function (deployer) {
  deployer.deploy(SendOTP).then(function () {
    return deployer
      .deploy(OTPGeneratorAndVerifier, SendOTP.address)
      .then(function () {
        return deployer.deploy(RUP).then(function () {
          return deployer.deploy(User, RUP.address).then(function () {
            return deployer
              .deploy(
                MachuPicchu,
                User.address,
                RUP.address,
                OTPGeneratorAndVerifier.address
              )
              .then(async function () {
                let paymasterD = await deployer.deploy(
                  paymaster,
                  MachuPicchu.address,
                  User.address
                );
                await paymasterD.setRelayHub(
                  "0xE9dcD2CccEcD77a92BA48933cb626e04214Edb92"
                );

                await paymasterD.setTrustedForwarder(
                  "0x0842Ad6B8cb64364761C7c170D0002CC56b1c498"
                );
              });
          });
        });
      });
  });
};
