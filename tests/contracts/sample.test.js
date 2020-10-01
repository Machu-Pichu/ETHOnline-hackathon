const { expect } = require('chai');

describe('Sample contract', () => {

  let contract;
  let deployer;

  beforeEach(async () => {
    const Sample = await ethers.getContractFactory("Sample");
    [ deployer  ] = await ethers.getSigners();
    
    contract = await Sample.connect(deployer).deploy();
    await contract.deployed();
  });

  it('should say hello', async () => {
    expect(await contract.sayHello()).to.equal("Hello !");
  });

});