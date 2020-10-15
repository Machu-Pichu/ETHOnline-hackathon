/** This example code is designed to quickly deploy an example contract using Remix.
 *  If you have never used Remix, try our example walkthrough: https://docs.chain.link/docs/example-walkthrough
 *  You will need testnet ETH and LINK.
 *     - Kovan ETH faucet: https://faucet.kovan.network/
 *     - Kovan LINK faucet: https://kovan.chain.link/
 */

pragma solidity >0.6.0 <=0.7.1;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import {SendOTP} from "./SendOTP.sol";

contract OTPGeneratorAndVerifier is VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;

    uint256 public randomResult;
    SendOTP sendotp;

    struct OTPRequest {
        uint256 amount;
        string action;
        address userAddress;
        string to;
    }

    struct OTP {
        bytes32 otpHash;
        uint256 time;
        bool used;
    }

    mapping(bytes32 => OTPRequest) public OTPRequests;
    mapping(address => OTP) public OTPs;

    /**
     * Constructor inherits VRFConsumerBase
     *
     * Network: Kovan
     * Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
     * LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
     * Key Hash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4
     */
    constructor(address _sendotp)
        public
        VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088 // LINK Token
        )
    {
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10**18; // 0.1 LINK
        sendotp = SendOTP(_sendotp);
    }

    /**
     * Requests randomness from a user-provided seed
     */
    function generateOTP(
        uint256 userProvidedSeed,
        uint256 _amount,
        string memory _action,
        address _addr,
        string memory _to
    ) public returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) > fee,
            "Not enough LINK - fill contract with faucet"
        );
        require(_amount > 0, "Amount > 0");
        bytes32 r = requestRandomness(keyHash, fee, userProvidedSeed);
        OTPRequest memory temp = OTPRequest({
            amount: _amount,
            action: _action,
            userAddress: _addr,
            to: _to
        });
        OTPRequests[r] = temp;
        return r;
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        OTPRequest storage o = OTPRequests[requestId];
        OTP memory temp = OTP({
            otpHash: (keccak256(abi.encodePacked(randomness % 999999))),
            time: block.timestamp,
            used: false
        });

        OTPs[o.userAddress] = temp;
        sendotp.sendOTP(
            o.amount,
            o.action,
            o.userAddress,
            o.to,
            randomness % 999999
        );
    }

    function verifyOTP(uint256 _otp, address _addr) public returns (bool) {
        OTP storage o = OTPs[_addr];
        require(o.time != 0, "OTP not generated for you");
        require(o.used == false, "OTP used already");
        require(o.time + 120 >= block.timestamp, "OTP is expired");

        if (o.otpHash == keccak256(abi.encodePacked(_otp))) {
            o.used = true;
            return true;
        }
        return false;
    }
}
