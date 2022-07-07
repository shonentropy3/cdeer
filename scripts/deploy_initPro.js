const { ethers } = require("hardhat");
const hre = require("hardhat");
const demandJson = require('../deployments/dev/Demand.json');
const orderJson = require('../deployments/dev/Demand.json');
const { abi } = require('../deployments/abi/Demand.json');

let accounts = [];
let owner;

async function main() {
    await hre.run('compile');
    accounts = await ethers.getSigners();
    owner = accounts[0];
    const demand = new ethers.Contract(demandJson.address, abi, owner);
    await demand.connect(owner).setOrder(orderJson.address);
  }

  main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });