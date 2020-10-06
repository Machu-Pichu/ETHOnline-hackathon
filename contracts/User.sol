pragma solidity >0.6.0 <=0.7.1;
pragma experimental ABIEncoderV2;

contract User {
   
    enum UserType {member, watcher, enabler}
   
    struct user {
        UserType usertype;
    }
   
    mapping(address => user) Users;
    mapping(address => bool) registerList;
   
    constructor() public {
       
    }
   
    function register(UserType _usertype) public {
        // require address not registered already
        require(registerList[msg.sender] == false, "You have already registered");
       
        user memory u = user({
            usertype: _usertype
        });
       
        registerList[msg.sender] = true;
        Users[msg.sender] = u;
    }
   
    function getUserRole(address _user) public view returns(UserType) {
        require(registerList[_user], "User not registered");
        user memory  u = Users[_user];
        return u.usertype;
    }
   
    function checkUserRole(address _user, UserType _usertype) public view returns(bool) {
        require(registerList[_user], "User not registered");
        user memory  u = Users[_user];
        if((u.usertype) == _usertype) {
            return true;
        }
        return false;
    }
   
}
