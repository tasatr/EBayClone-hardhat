const { network } = require("hardhat");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("EBayClone contract", function () {
  it("Should see number of pending transactions", async function () {
    const [owner] = await ethers.getSigners();

    const EBayClone = await ethers.getContractFactory("EBayClone");

    const ebay = await EBayClone.deploy();

    await ebay.sellProduct("First book", "A lovely book to read first", 1);
    expect(await ebay.getNumberOfProducts()).to.equal(1);

    await ebay.sellProduct("Second book", "A lovely book to read next", 1);
    expect(await ebay.getNumberOfProducts()).to.equal(2);

  });
});
