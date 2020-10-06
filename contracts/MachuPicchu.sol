// SPDX-License-Identifier: MIT
pragma solidity >0.6.0 <=0.7.1;

contract MachuPicchu {

  /* Represent the information stored for each member */
  struct Member {
    string name;
    string village;
    uint lat;
    uint lng;
    uint contribution;
    uint onboardingDate;
  }

  /* Event emitted at each onboarded member */
  event NewMember (
    address memberAddress
  );

  /* Event emitted at each contribution */
  event NewContribution (
    address memberAddress,
    uint amount
  );

  /* Public mapping between a member address to the member's details */
  mapping (address => Member) public members;

  /* Public total amount of the pot (sum of all contributions) */
  uint public pot;

  /*
    Register a new member.
    Revert if:
      - msg.sender is already registered  
  */
  function onboard(
    string calldata _name,
    string calldata _village,
    uint _lat,
    uint _lng
  ) public {
    // Verifies that the address has never been registered
    require(members[msg.sender].onboardingDate == 0, "address already onboarded");

    // Stores member data
    members[msg.sender].name = _name;
    members[msg.sender].village = _village;
    members[msg.sender].lat = _lat;
    members[msg.sender].lng = _lng;
    members[msg.sender].onboardingDate = block.timestamp;

    // Emit event
    emit NewMember(msg.sender);
  }

  /*
    Record new contribution.
    Revert if: 
      - msg.sender is not registered
      - no ETH is sent with the transaction
  */
  function contribute()
    public
    payable
    {
      // TODO: use UserContract to validate that msg.sender is registered as Member
      // Validates the received wei amount
      require(msg.value >= 1 wei, "minimal contribution is 1 wei");

      // Increments member's balance and pot
      // TODO: should use SafeMath lib here
      members[msg.sender].contribution += msg.value;
      pot += msg.value;

      emit NewContribution(
        msg.sender,
        msg.value
      );
    }

}
