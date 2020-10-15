// SPDX-License-Identifier: MIT

pragma solidity >0.6.0 <=0.7.1;
pragma experimental ABIEncoderV2;

import {User} from "./User.sol";
import {RUP} from "./token/RUP.sol";
import {OTPGeneratorAndVerifier} from "./otp/OTPGeneratorAndVerifier.sol";

contract MachuPicchu {
    address payable public owner;
    uint256 public startTime;

    uint8 public currentMonth;
    uint256 public assessmentId;
    uint8 public totalGroups = 3;
    uint256 public group1Loss = 0;
    uint256 public group2Loss = 0;
    uint256 public group3Loss = 0;

    //Considering MTBF of the community as 48 months = 4 years
    uint256 MTBF = 2;

    User userContract;
    RUP tokenContract;
    OTPGeneratorAndVerifier otpContract;

    constructor(
        address payable _userContract,
        address _tokenContract,
        address _otpContract
    ) public {
        assessmentId = 0;
        startTime = block.timestamp;
        currentMonth = 0;
        userContract = User(_userContract);
        tokenContract = RUP(_tokenContract);
        otpContract = OTPGeneratorAndVerifier(_otpContract);
        owner = msg.sender;
    }

    /* Represent the information stored for each member */
    struct Member {
        string name;
        string village;
        uint256 lat;
        uint256 lng;
        uint256 contribution;
        uint256 onboardingDate;
        string mobileNo;
        uint24 groupId;
        uint256 merit;
    }

    struct Assessment {
        uint256 id;
        uint24 groupId;
        uint8 all;
        uint256 time;
    }

    /* Public mapping between a member address to the member's details */
    mapping(address => Member) public members;
    address[] public membersAddresses;
    mapping(address => mapping(uint8 => uint256)) Stakes;
    mapping(uint8 => mapping(uint24 => uint256[])) groupAssessments;
    mapping(uint256 => Assessment) Assessments;
    mapping(uint8 => mapping(address => uint256[])) watcherAssessments;
    mapping(uint8 => mapping(address => uint256)) public compensationAmount;

    /* Public total amount of the pot (sum of all contributions) */
    uint256 public pot;

    modifier registeredMember(address _user) {
        bool temp = userContract.checkUserRole(_user, User.UserType(0));
        require(temp, "You are not a member");
        _;
    }

    modifier registeredWatcher(address _user) {
        bool temp = userContract.checkUserRole(_user, User.UserType(1));
        require(temp, "You are not a watcher");
        _;
    }

    modifier registeredEnabler(address _user) {
        bool temp = userContract.checkUserRole(_user, User.UserType(2));
        require(temp, "You are not a Enabler");
        _;
    }

    /* Event emitted at each onboarded member */
    event NewMember(address memberAddress);

    /* Event emitted at each contribution */
    event NewContribution(address memberAddress, uint256 amount);

    event watcherStakedForMonth(address indexed, uint8 indexed, uint256);

    event watcherAssessedGroup(address indexed, uint24 indexed);

    //Defining an event post Compensation amount Transfer
    event CompensationTransfer(address member, uint256 amount);

    /*
    Register a new member.
    Revert if:
      - msg.sender is already registered  
  */
    function onboardMember(
        string memory _name,
        string memory _village,
        uint256 _lat,
        uint256 _lng,
        string memory _mobileNo
    ) public registeredMember(msg.sender) {
        // Verifies that the address has never been registered
        require(
            members[msg.sender].onboardingDate == 0,
            "address already onboarded"
        );
        // Stores member data
        members[msg.sender].name = _name;
        members[msg.sender].village = _village;
        members[msg.sender].lat = _lat;
        members[msg.sender].lng = _lng;
        members[msg.sender].onboardingDate = block.timestamp;
        members[msg.sender].mobileNo = _mobileNo;
        members[msg.sender].groupId = getGroupId(_lat, _lng);
        membersAddresses.push(msg.sender);
        // Emit event
        emit NewMember(msg.sender);
    }

    /*
    Record new contribution.
    Revert if: 
      - msg.sender is not registered
      - no ETH is sent with the transaction
  */
    function contribute(uint256 otp, uint256 amount)
        public
        registeredMember(msg.sender)
    {
        // OTP validation has to be done
        require(
            otpContract.verifyOTP(otp, msg.sender),
            "OTP is either expired or wrong"
        );
        // transfer tokens to this contract after minting on behalf of msg.sender
        tokenContract._mint(address(this), (amount));
        // Increments member's balance and pot
        // TODO: should use SafeMath lib here
        members[msg.sender].contribution += amount;
        pot += amount;

        emit NewContribution(msg.sender, amount);
    }

    function preContributeVerification(uint256 amount)
        public
        registeredMember(msg.sender)
    {
        require(amount > 2, "Amount > 2 required");
        otpContract.generateOTP(
            block.timestamp,
            amount,
            "contributing",
            msg.sender,
            members[msg.sender].mobileNo
        );
    }

    function getGroupId(uint256 _lat, uint256 _lng)
        private
        pure
        returns (uint24)
    {
        // on the basis of _lat and _lng we will have to allot a groupId
        uint256 t = _lat + _lng;
        if (t <= 10) {
            return 1;
        } else if (t > 10 && t <= 20) {
            return 2;
        } else {
            return 3;
        }
    }

    /**
     * To perform Assessment by a watcher for a particular group(group of fields) for the current month
     * @param groupId Groupid alloted in User contract
     * @param _all The final result by watcher
     *  Before calling this, check if assessment done by this watcher for this group already
     **/
    function doAssessmentForAGroup(uint24 groupId, uint8 _all)
        public
        registeredWatcher(msg.sender)
    {
        // check for nextMonth
        uint8 nextMonth = getCurrentMonth();
        if (nextMonth > currentMonth) {
            currentMonth = nextMonth;
        }
        // require minimum amount staked
        require(
            Stakes[msg.sender][currentMonth] > 20,
            "You should stake first"
        );
        //
        // make Assessment object
        Assessment memory asmt = Assessment({
            id: assessmentId,
            groupId: groupId,
            all: _all,
            time: block.timestamp
        });
        // add to Assessments list
        Assessments[assessmentId] = asmt;
        // add to groupAssessments list
        groupAssessments[currentMonth][groupId].push(assessmentId);
        // add to watcherAssessments list
        watcherAssessments[currentMonth][msg.sender].push(assessmentId);
        // event
        emit watcherAssessedGroup(msg.sender, groupId);
        // increment assessmentId by 1
        assessmentId += 1;
    }

    /**
     * To get assessment of a group of a particular month
     * @param monthId month-id
     * @param groupId group-id
     * @return array of assessment ids
     *
     **/
    function getAssessmentsOfAGroup(uint8 monthId, uint24 groupId)
        public
        view
        returns (uint256[] memory)
    {
        return groupAssessments[monthId][groupId];
    }

    /**
     * To get assessment of a watcher of a particular month
     * @param monthId month-id
     * @return array of assessment ids
     *
     **/
    function getAssessmentsDoneByAWatcher(uint8 monthId)
        public
        view
        registeredWatcher(msg.sender)
        returns (uint256[] memory)
    {
        return watcherAssessments[monthId][msg.sender];
    }

    /**
     * To get detail of a particular assessment
     * @param _id assessment-id
     * @return Assessment struct
     *
     **/
    function getAssessmentDetail(uint256 _id)
        public
        view
        returns (Assessment memory)
    {
        return Assessments[_id];
    }

    /**
     * To stake/increment in stake for the currentMonth by a watcher
     *
     **/
    function stake(uint256 amount) public registeredWatcher(msg.sender) {
        require(amount > 20, "Your stake amount is not sufficient");
        // check for nextMonth
        uint8 nextMonth = getCurrentMonth();
        if (nextMonth > currentMonth) {
            currentMonth = nextMonth;
        }
        tokenContract.transferFrom(msg.sender, address(this), amount);
        Stakes[msg.sender][currentMonth] += amount;
        emit watcherStakedForMonth(msg.sender, currentMonth, amount);
    }

    /**
     * To get total staked anount of a watcher
     * @return total amount
     *
     **/
    function getTotalStakeAmounts()
        public
        view
        registeredWatcher(msg.sender)
        returns (uint256)
    {
        mapping(uint8 => uint256) storage temp = Stakes[msg.sender];
        uint256 totakStakedAmount = 0;
        for (uint8 i = 1; i <= 12; i++) {
            totakStakedAmount += temp[i];
        }
        return totakStakedAmount;
    }

    /**
     * To get total staked anount of a watcher in a particular month
     * @param monthId month-id
     * @return total amount
     *
     **/
    function getStakedAmountInAMonth(uint8 monthId)
        public
        view
        registeredWatcher(msg.sender)
        returns (uint256)
    {
        mapping(uint8 => uint256) storage temp = Stakes[msg.sender];
        return temp[monthId];
    }

    /**
     * To get current month
     * @return current month
     *
     **/
    function getCurrentMonth() public view returns (uint8) {
        return uint8((startTime - block.timestamp) / 60 / 60 / 24 / 30) % 12;
    }

    function monthlyLossCalculation() public {
        // aim to make it automatic on detect of month change
        // right now owner of the contract can only do it
        require(msg.sender == owner, "You are not authorised");


            mapping(uint24 => uint256[]) storage assessments
         = groupAssessments[currentMonth];
        uint256 group1LossTotal;
        uint256 group2LossTotal;
        uint256 group3LossTotal;

        for (uint256 i = 0; i < assessments[1].length; i++) {
            group1LossTotal += Assessments[assessments[1][i]].all;
        }

        for (uint256 i = 0; i < assessments[2].length; i++) {
            group2LossTotal += Assessments[assessments[2][i]].all;
        }

        for (uint256 i = 0; i < assessments[3].length; i++) {
            group3LossTotal += Assessments[assessments[3][i]].all;
        }

        group1Loss = group1LossTotal / assessments[1].length;
        group2Loss = group2LossTotal / assessments[2].length;
        group3Loss = group3LossTotal / assessments[3].length;

        // check watchers data and reward/punish them remaining
    }

    //Calculate merit of member based on Avg monthly contribution
    function calcMerit(address _member) private returns (uint256) {
        uint256 totalMonth = (block.timestamp -
            members[_member].onboardingDate) /
            60 /
            60 /
            24 /
            30;
        uint256 merit = members[_member].contribution / (totalMonth + 1);
        members[_member].merit = merit;
        return merit;
    }

    //Calculate Compensation of partiucualr member & transfer to member account
    function calcCompensation() public registeredEnabler(msg.sender) {
        //Below value will come from Watcher smart contract
        for (uint256 i = 0; i < membersAddresses.length; i++) {
            Member memory m = members[membersAddresses[i]];
            uint256 lossPercent = 0;

            if (m.groupId == 1) {
                lossPercent = group1Loss;
            } else if (m.groupId == 2) {
                lossPercent = group2Loss;
            } else if (m.groupId == 3) {
                lossPercent = group3Loss;
            }

            uint256 memberMerit = calcMerit(membersAddresses[i]);
            uint256 compAmount = (lossPercent * memberMerit * MTBF) / 100;
            compensationAmount[currentMonth][membersAddresses[i]] = compAmount;
        }

        group1Loss = 0;
        group2Loss = 0;
        group3Loss = 0;
    }

    function payoutCompensation(uint256 otp)
        public
        registeredMember(msg.sender)
    {
        // OTP validation has to be done
        require(
            otpContract.verifyOTP(otp, msg.sender),
            "OTP is either expired or wrong"
        );
        require(
            compensationAmount[currentMonth][msg.sender] <= pot,
            "Not enough amount in pot"
        );
        uint256 amount = compensationAmount[currentMonth][msg.sender];
        compensationAmount[currentMonth][msg.sender] = 0;
        pot -= amount;
        tokenContract._burn(address(this), amount);
        emit CompensationTransfer(msg.sender, amount);
    }

    function prePayoutVerification() public registeredMember(msg.sender) {
        otpContract.generateOTP(
            block.timestamp,
            compensationAmount[currentMonth][msg.sender],
            "compensation",
            msg.sender,
            members[msg.sender].mobileNo
        );
    }
}
