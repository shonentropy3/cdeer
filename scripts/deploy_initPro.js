const { ethers } = require("hardhat");
const hre = require("hardhat");
const demandJson = require('../deployments/dev/Demand.json');
const orderJson = require('../deployments/dev/Order.json');
const { abi } = require('../deployments/abi/Demand.json');

let accounts = [];
let owner;

async function main() {
    await hre.run('compile');
    accounts = await ethers.getSigners();
    owner = accounts[0];
    const demand = new ethers.Contract(demandJson.address, abi, owner);
    console.log("orderJson.address------", orderJson.address);
    await demand.connect(owner).setOrder(orderJson.address);

    for (let i = 0; i < 4; i++) {
      //创建需求
      await demand.connect(accounts[3]).createDemand(
        { 
            title: "test",
            desc: "desc",
            attachment: "attachment",
            budget: ethers.utils.parseEther("5"),
            period: 123423
        },
        {
            value: ethers.utils.parseEther("1"),
        });
    }
  }

  main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });