# ETHOnline Hackathon 2020
Machu-Picchu dApp for ETHGlobal Hackathon

## To deploy updated contracts/To initailise the contracts

1. Navigate to `hackathon folder`
2. Run `npm install @truffle/hdwallet-provider`
3. Run `truffle compile --all`
4. Run `truffle migrate --network {network-name} --reset`
5. Now run the client

## To run the app on local

1. Clone the repository
2. Navigate to the `hackathon/client` folder of your local disk
3. Do `npm install` first (make sure with `node --version`that your `node.js`version does not exceed v12, else `keccak` installation will have errors)
4. Then `npm start` and open 'http://localhost:3000' in your browser

## Dapp pre-requisites (KOVAN TESTNET)

1. The OpenGSN Paymaster Contract ( 0xC1e8E5B8b9091BA103018d5Bf837E30930FB8fDe ) should have sufficient ETH to pay for the gas fees for farmers and enablers.
2. The OTP contracts ( OTPGeneratorAndVerifier: 0x5AA2BF10E91e15B5f8917075ABaCE412045A8d7c [0.1 LINK per request] and SendOTP: 0x987B5Ab4Ec7BE19D151D5cE02A99Baa6400693C0 [0.05 LINK per request] ) should have enough LINK tokens to pay for the Chainlink service.

## Checklist while Testing

1. Please contribute more than 2 RUP Tokens from Members 
2. Please stake more than 20 RUP Tokens from watchers
3. We will need to validate your mobile number before the OTP service as we are on trial.
 
## Overall context of _Machu Picchu_ hackathon showcase
![Overall context](https://github.com/Machu-Pichu/hackathon/blob/logos/common/images/20201002%20Machu%20Picchu%20Overall%20Vision.png)

## Content of _Machu Picchu_ hackathon showcase
To be updated when the demo is finished.

![Actual showcase](https://github.com/Machu-Pichu/hackathon/blob/logos/common/images/20201006%20Hackathon%20showcase%20v1.0.png)

## Flow diagram

![mp](https://user-images.githubusercontent.com/24249646/96636170-86786480-133a-11eb-8b88-c3b583264810.jpg)

