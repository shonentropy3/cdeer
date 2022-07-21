const { ethers } = require("hardhat");
const hre = require("hardhat");
const demandJson = require('../deployments/dev/Demand.json');
const orderJson = require('../deployments/dev/Order.json');
const { abi } = require('../deployments/abi/Demand.json');
const orderAbi = require('../deployments/abi/Order.json');

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

    // 订单模块
    const order = new ethers.Contract(orderJson.address, orderAbi.abi, owner);
    console.log("orderJson.address------", orderJson.address);
    await order.connect(accounts[3]).createOrder(
      { 
        demandId: 3,
        applyAddr: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
        token: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
        amount: ethers.utils.parseEther("5"),
        checked: 1,
        startDate: 123423
    });

    map = await order.connect(accounts[3]).applyOrderIds(1,accounts[3].address);
    // map['0x']
    console.log(map)
    let orderIdTest = await order.connect(accounts[3]).orders(0);
    orderIdTest = orderIdTest[4]
    // let checked = Array.from(orderIdTest).forEach(ele => {
    //   console.log(ele);
    // });
    console.log(orderIdTest);
  }

  main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });