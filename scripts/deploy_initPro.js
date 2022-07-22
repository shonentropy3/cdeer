const { ethers } = require("hardhat");
const hre = require("hardhat");
const taskJson = require('../deployments/dev/Task.json');
const orderJson = require('../deployments/dev/Order.json');
const { abi } = require('../deployments/abi/Task.json');
const orderAbi = require('../deployments/abi/Order.json');

let accounts = [];
let owner;

async function main() {
    await hre.run('compile');
    accounts = await ethers.getSigners();
    owner = accounts[0];
    const task = new ethers.Contract(taskJson.address, abi, owner);
    console.log("orderJson.address------", orderJson.address);
    await task.connect(owner).setOrder(orderJson.address);

    for (let i = 0; i < 4; i++) {
      //创建需求
      await task.connect(accounts[3]).createTask(
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

    // 订单模块
    const order = new ethers.Contract(orderJson.address, orderAbi.abi, owner);
    console.log("orderJson.address------", orderJson.address);
    await order.connect(accounts[3]).createOrder(
      { 
        taskId: 3,
        taker: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
        token: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
        amount: ethers.utils.parseEther("5"),
        checked: 1,
        startDate: 123423
    });

    map = await order.connect(accounts[3]).applyOrderIds(1,accounts[3].address);
  }

  main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });