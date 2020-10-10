// SPDX-License-Identifier: MIT

pragma solidity >0.6.0 <=0.7.1;
pragma experimental ABIEncoderV2;
import {RUP} from "./token/RUP.sol";

contract User {
    enum UserType {member, watcher, enabler}

    struct user {
        UserType usertype;
    }

    mapping(address => user) Users;
    mapping(address => bool) registerList;
    RUP tokenContract;

    constructor(address _tokenContract) public payable {
        tokenContract = RUP(_tokenContract);
    }

    function register(UserType _usertype) public {
        // require address not registered already
        require(
            registerList[msg.sender] == false,
            "You have already registered"
        );

        user memory u = user({usertype: _usertype});

        registerList[msg.sender] = true;
        Users[msg.sender] = u;

        // initially mint 100 tokens for a watcher to staker - later he will either burrow or swap
        if (_usertype == UserType.watcher) {
            tokenContract._mint(msg.sender, (100));
        }

        // give some ether to user for demo purposes
        msg.sender.transfer(0.05 ether);
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
        uint i = 0;
            // React to receiving ether
    }
}