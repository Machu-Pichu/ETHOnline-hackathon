const MachuPicchu = artifacts.require("./MachuPicchu.sol");
const truffleAssert = require('truffle-assertions');

contract('MachuPicchu contract', (accounts) => {

  let contract;
  let deployer;
  let member1;
  let member2;

  beforeEach(async () => {
    contract = await MachuPicchu.new();
    //contract = await MachuPicchu.deployed();
    [ deployer, member1, member2 ] = accounts;
  });

  it('allows member to register', async () => {
    // Register member1, and validates that the Registration event is emitted
    await contract.onboard("My name", "My village", 10, 11, { from: member1 });
    
    // Get registered member
    const newMember = await contract.members(member1);
    
    // Validate data
    assert.equal(newMember.village, "My village");
    assert.equal(newMember.name, "My name");
    assert.equal(newMember.lat, 10);
    assert.equal(newMember.lng, 11);
    assert.equal(newMember.contribution, 0);
  });

  it('reverts duplicate registration', async () => {
    // Register member1
    await contract.onboard("My name", "My village", 10, 11, { from: member1 });

    // Try to re-register member1
    await truffleAssert.reverts(
      contract.onboard("My name", "My village", 10, 11, { from: member1 })
    );
  });

  it('allows registered member to contribute', async () => {
    // Register member1
    await contract.onboard("My name", "My village", 10, 11, { from: member1 });

    // Make a contribution of 1 ETH, and validates that the Contribution event is emitted
    await contract.contribute({ value: 1, from: member1 });

    // Validate data
    assert.equal(await contract.pot(), 1);

    const member = await contract.members(member1);
    assert.equal(member.contribution, 1);
  });

  it('sums all contribution to the pot', async () => {
    // Register member1
    await contract.onboard("My name", "My village", 10, 11, { from: member1 });

    // Register member2
    await contract.onboard("My name", "My village", 10, 11, { from: member2 });

    // Member1 contributes with 1 eth
    await contract.contribute({ value: 1, from: member1 });

    // Member2 contributes with 2 eth
    await contract.contribute({ value: 2, from: member2 });

    // Validate pot
    assert.equal(await contract.pot(), 3);

    // Validate Smart Contract balance
    assert.equal(await web3.eth.getBalance(contract.address), 3);
    
    // Validate member1 balance
    const member1data = await contract.members(member1);
    assert.equal(member1data.contribution, 1);

    // Validate member2 balance
    const member2data = await contract.members(member2);
    assert.equal(member2data.contribution, 2);
  });

});