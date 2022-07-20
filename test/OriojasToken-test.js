const { expect } = require("chai");
const { ethers } = require("hardhat");

const initialSupply = 100000;
const tokenName = "OriojasToken";
const tokenSymbol = "ORTK";

describe("Oriojas token test", function () {
  // Esta parte se llama setup de despliegue
  before(async function(){
    const availableSigners = await ethers.getSigners();
    this.deployer = availableSigners[0];

    const OriojasToken = await ethers.getContractFactory("OriojasToken"); // busca el contratoen la carpeta contracts
    this.oriojasToken = await OriojasToken.deploy(tokenName, tokenSymbol); // esta funcion hace el deploy
    await this.oriojasToken.deployed(); 
  });

  // Esta prueba valida que el nombre deltoken sea el esperado
  it("Should be name d OriojasToken", async function () {
    const fetchedTokenName = await this.oriojasToken.name();
    expect(fetchedTokenName).to.be.equal(tokenName);
  });

  // Esta prueba valida que el simbolo del token sea el adecuado
  it("Shoul haved symbol ORTK", async function() {
    const fetchedTokenSymbol = await this.oriojasToken.symbol();
    expect(fetchedTokenSymbol).to.be.equal(tokenSymbol);
  });

  // Esta prueba validaque el contrato iniciel con la cantidad de tokens de la variable initialSupply
  it('Should have totalSupply passed in during deploying', async function() {
    const [ fetchedTotalSupply, decimals ] = await Promise.all([
      this.oriojasToken.totalSupply(),
      this.oriojasToken.decimals(),
    ]);
    const expectedTotalSupply = ethers.BigNumber.from(initialSupply).mul(ethers.BigNumber.from(10).pow(decimals));
    expect(fetchedTotalSupply.eq(expectedTotalSupply)).to.be.true;
  });

});
