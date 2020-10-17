pragma solidity >0.6.0 <=0.7.1;
pragma experimental ABIEncoderV2;

// SPDX-License-Identifier: MIT OR Apache-2.0

import {User} from "../User.sol";
import "@opengsn/gsn/contracts/forwarder/IForwarder.sol";
import "@opengsn/gsn/contracts/BasePaymaster.sol";

contract MachuPicchuPaymentmaster is BasePaymaster {
    address public mainContract;
    User userContract;

    // allow the owner to set ourTarget
    event TargetSet(address target);

    // function setTarget(address target) external onlyOwner {
    //     ourTarget = target;
    //     emit TargetSet(target);
    // }

    constructor(address _mainC, address payable _userC) public {
        mainContract = _mainC;
        userContract = User(_userC);
    }

    event PreRelayed(uint256);
    event PostRelayed(uint256);

    function preRelayedCall(
        GsnTypes.RelayRequest calldata relayRequest,
        bytes calldata signature,
        bytes calldata approvalData,
        uint256 maxPossibleGas
    ) external virtual override returns (bytes memory context, bool) {
        _verifyForwarder(relayRequest);
        (signature, approvalData, maxPossibleGas);

        require(
            relayRequest.request.to == mainContract ||
                relayRequest.request.to == address(userContract),
            "Not allowed"
        );
        if (relayRequest.request.to == address(userContract)) {
            emit PreRelayed(now);
            return (abi.encode(now), false);
        }

        if (
            userContract.checkUserRole(
                relayRequest.request.from,
                User.UserType(2)
            )
        ) {
            revert("Watcher not allowed");
        }
    }

    function postRelayedCall(
        bytes calldata context,
        bool success,
        uint256 gasUseWithoutPost,
        GsnTypes.RelayData calldata relayData
    ) external virtual override {
        (context, success, gasUseWithoutPost, relayData);
        emit PostRelayed(abi.decode(context, (uint256)));
    }

    function versionPaymaster()
        external
        virtual
        override
        view
        returns (string memory)
    {
        return "1.0";
    }
}
