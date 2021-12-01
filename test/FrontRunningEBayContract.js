const { network } = require("hardhat");
const { ethers } = require("hardhat");
const { expect } = require("chai");
const abiDecoder = require('abi-decoder')


describe("EBayClone contract", function () {
  it("Should see number of pending transactions", async function () {
    const [owner] = await ethers.getSigners();

    const EBayClone = await ethers.getContractFactory("EBayClone");

    const ebay = await EBayClone.deploy();

    await network.provider.send("evm_setAutomine", [false]);
    await network.provider.send("evm_setIntervalMining", [5000]);

    await ebay.sellProduct("First book", "A lovely book to read first", 1);
    // expect(await ebay.getNumberOfProducts()).to.equal(1);

    await ebay.sellProduct("Second book", "A lovely book to read next", 1);
    // expect(await ebay.getNumberOfProducts()).to.equal(2);

    const pendingBlock = await network.provider.send('eth_getBlockByNumber', ['pending', false])
    console.log(
        `There are ${pendingBlock.transactions.length} pending transactions in the next block.`
    );

    const ebayCloneABI = [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "buyProduct",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getNumberOfProducts",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "products",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_price",
            "type": "uint256"
          }
        ],
        "name": "sellProduct",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    abiDecoder.addABI(ebayCloneABI);

    for (const txHash of pendingBlock.transactions) {
            const tx = await network.provider.send('eth_getTransactionByHash', [txHash])

            const decodedCall = abiDecoder.decodeMethod(tx.input)

            console.log(`DECODED CALL:  ${decodedCall.name}`)
    }
  });
});
