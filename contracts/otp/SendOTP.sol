/** This example code is designed to quickly deploy an example contract using Remix.
 *  If you have never used Remix, try our example walkthrough: https://docs.chain.link/docs/example-walkthrough
 *  You will need testnet ETH and LINK.
 *     - Kovan ETH faucet: https://faucet.kovan.be/
 *     - Kovan LINK faucet: https://kovan.chain.link/
 
 */

pragma solidity >0.6.0 <=0.7.1;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";

contract SendOTP is ChainlinkClient {
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    uint256 public tslaPrice;

    constructor() public {
        setPublicChainlinkToken();
        oracle = 0xcb65E9b36eB788Ab0F94f06FB3906EcfAF4e055A; // oracle address
        jobId = "e0347d6a51a64b1abf7fbbda9f34a1bd"; //job id
        fee = 0.05 * 10**18; // 0.1 LINK
    }

    /**
     * Make initial request
     */
    function sendOTP(
        uint256 _amount,
        string memory _action,
        address _addr,
        string memory _to,
        uint256 _otp
    ) public {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.recieveResponse.selector
        );
        req.add("member", toAsciiString(_addr));
        req.add("amount", uint2str(_amount));
        req.add("otp", uint2str(_otp));
        req.add("action", _action);
        req.add("to", _to);
        string[] memory copyPath = new string[](1);
        copyPath[0] = "result";
        req.addStringArray("copyPath", copyPath);
        sendChainlinkRequestTo(oracle, req, fee);
    }

    /**
     * Callback function
     */
    function recieveResponse(bytes32 _requestId, uint256 _price)
        public
        recordChainlinkFulfillment(_requestId)
    {
        tslaPrice = _price;
    }

    // Helper functino - convert address to string
    function toAsciiString(address x) private pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint256(x) / (2**(8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i] = char(hi);
            s[2 * i + 1] = char(lo);
        }
        return string(abi.encodePacked("0x", string(s)));
    }

    function char(bytes1 b) private pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + (_i % 10)));
            _i /= 10;
        }
        return string(bstr);
    }
}
