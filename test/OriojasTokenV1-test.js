const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

const initialSupply = 1000000;
const tokenName = "OriojasTokenV1";
const tokenSymbol = "ORTK";

describe("OriojasTokenV1 token tests", function() {
  let oriojasTokenV1;
  let oriojasTokenV2;
  let deployer;
  let userAccount;

  describe("V1 tests", function () {
    before(async function() {
      const availableSigners = await ethers.getSigners();
      deployer = availableSigners[0];

      const OriojasToken = await ethers.getContractFactory("OriojasTokenV1");

      // this.oriojasTokenV1 = await OriojasToken.deploy(initialSupply);
      oriojasTokenV1 = await upgrades.deployProxy(OriojasToken, [initialSupply], { kind: "uups" });
      await oriojasTokenV1.deployed();
    });

    it('Should be named OriojasTokenV1', async function() {
      const fetchedTokenName = await oriojasTokenV1.name();
      expect(fetchedTokenName).to.be.equal(tokenName);
    });

    it('Should have symbol "ORTK"', async function() {
      const fetchedTokenSymbol = await oriojasTokenV1.symbol();
      expect(fetchedTokenSymbol).to.be.equal(tokenSymbol);
    });

    it('Should have totalSupply passed in during deployment', async function() {
      const [ fetchedTotalSupply, decimals ] = await Promise.all([
        oriojasTokenV1.totalSupply(),
        oriojasTokenV1.decimals(),
      ]);
      const expectedTotalSupply = ethers.BigNumber.from(initialSupply).mul(ethers.BigNumber.from(10).pow(decimals));
      expect(fetchedTotalSupply.eq(expectedTotalSupply)).to.be.true;
    });

    it('Should run into an error when executing a function that does not exist', async function () {
      expect(() => oriojasTokenV1.mint(deployer.address, ethers.BigNumber.from(10).pow(18))).to.throw();
    });
  });

  
  // describe("V2 tests", function () {
  //   before(async function () {

  //     userAccount = (await ethers.getSigners())[1];

  //     const OriojasTokenV2 = await ethers.getContractFactory("OriojasTokenV2");

  //     oriojasTokenV2 = await upgrades.upgradeProxy(oriojasTokenV1.address, OriojasTokenV2);


  //     await oriojasTokenV2.deployed();

  //   });

  //   it("Should has the same address, and keep the state as the previous version", async function () {
  //     const [totalSupplyForNewCongtractVersion, totalSupplyForPreviousVersion] = await Promise.all([
  //       oriojasTokenV2.totalSupply(),
  //       oriojasTokenV1.totalSupply(),
  //     ]);
  //     expect(oriojasTokenV1.address).to.be.equal(oriojasTokenV2.address);
  //     expect(totalSupplyForNewCongtractVersion.eq(totalSupplyForPreviousVersion)).to.be.equal(true);
  //   });

  //   it("Should revert when an account other than the owner is trying to mint tokens", async function() {
  //     const tmpContractRef = await oriojasTokenV2.connect(userAccount);
  //     try {
  //       await tmpContractRef.mint(userAccount.address, ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)));
  //     } catch (ex) {
  //       expect(ex.message).to.contain("reverted");
  //       expect(ex.message).to.contain("Ownable: caller is not the owner");
  //     }
  //   });

  //   it("Should mint tokens when the owner is executing the mint function", async function () {
  //     const amountToMint = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)).mul(ethers.BigNumber.from(10));
  //     const accountAmountBeforeMint = await oriojasTokenV2.balanceOf(deployer.address);
  //     const totalSupplyBeforeMint = await oriojasTokenV2.totalSupply();
  //     await oriojasTokenV2.mint(deployer.address, amountToMint);

  //     const newAccountAmount = await oriojasTokenV2.balanceOf(deployer.address);
  //     const newTotalSupply = await oriojasTokenV2.totalSupply();
      
  //     expect(newAccountAmount.eq(accountAmountBeforeMint.add(amountToMint))).to.be.true;
  //     expect(newTotalSupply.eq(totalSupplyBeforeMint.add(amountToMint))).to.be.true;
  //   });
  // });


});