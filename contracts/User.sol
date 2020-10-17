// SPDX-License-Identifier: MIT

pragma solidity >0.6.0 <=0.7.1;
pragma experimental ABIEncoderV2;
import {RUP} from "./token/RUP.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@opengsn/gsn/contracts/interfaces/IKnowForwarderAddress.sol";

contract User is BaseRelayRecipient, IKnowForwarderAddress {
    string public override versionRecipient = "2.0.0";

    enum UserType {member, watcher, enabler}

    struct user {
        UserType usertype;
    }

    mapping(address => user) Users;
    mapping(address => bool) registerList;
    RUP tokenContract;

    constructor(address _tokenContract) public {
        tokenContract = RUP(_tokenContract);
        trustedForwarder = address(0x0842Ad6B8cb64364761C7c170D0002CC56b1c498);
    }

    function register(UserType _usertype) public {
        // require address not registered already
        require(
            registerList[_msgSender()] == false,
            "You have already registered"
        );

        user memory u = user({usertype: _usertype});

        registerList[_msgSender()] = true;
        Users[_msgSender()] = u;

        // initially mint 100 tokens for a watcher to staker - later he will either burrow or swap
        if (_usertype == UserType.watcher) {
            tokenContract._mint(_msgSender(), (100));
        }

        // give some ether to user for demo purposes
        // _msgSender().transfer(0.05 ether);
    }

    function getUserRole(address _user) public view returns (UserType) {
        require(registerList[_user], "User not registered");
        user memory u = Users[_user];
        return u.usertype;
    }

    function checkUserRole(address _user, UserType _usertype)
        public
        view
        returns (bool)
    {
        require(registerList[_user], "User not registered");
        user memory u = Users[_user];
        if ((u.usertype) == _usertype) {
            return true;
        }
        return false;
    }

    receive() external payable {
        uint256 i = 0;
        // React to receiving ether
    }

    function getTrustedForwarder() public override view returns (address) {
        return trustedForwarder;
    }
}
