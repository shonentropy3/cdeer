const { ethers } = require("hardhat");
const hre = require("hardhat");
const taskJson = require('../deployments/dev/DeTask.json');
const orderJson = require('../deployments/dev/Order.json');
const { abi } = require('../deployments/abi/DeTask.json');
const orderAbi = require('../deployments/abi/Order.json');

let accounts = [];
let owner;

async function main() {
    await hre.run('compile');
    accounts = await ethers.getSigners();
    owner = accounts[0];
    // console.log(owner,"owner")
    const task = new ethers.Contract(taskJson.address, abi, owner);
    await task.connect(owner).setOrder(orderJson.address);
    // console.log(owner.address,'============>');
    // //创建需求
    await task.connect(accounts[3]).createTask(
      '0x5f2CC90663c2599c306984c43E7C93F7FD8E773e',
      {
        title: "test",
        desc: "desc",
        attachment: "",
        currency: 1,  //  币种,x10000,保留四位小数,前端只展示两位小数
        budget: 222,
        period: 123213,
        categories: 1,
        skills: 1,  //  原role,职业为1,2,3...整数型
      },
      {
          value: ethers.utils.parseEther("1"),
      }).then(res => {
        console.log(res);
      }).catch(err => {
        console.log('=====>>>>>>>>>>>',err);
      })


    // // 订单模块
    // const order = new ethers.Contract(orderJson.address, orderAbi.abi, owner);
    // // console.log("orderJson.address------", orderJson.address);
    // await order.connect(accounts[3]).createOrder(
    //   { 
    //     taskId: 1,
    //     worker: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    //     token: "0x0000000000000000000000000000000000000000",
    //     amount: ethers.utils.parseEther("5"),
    //     checked: 1,
    //     startDate: 123423
    // });

    // // 设置阶段
    // await order.connect(accounts[4]).setStage(1,"0x0000000000000000000000000000000000000000",
    // [ethers.utils.parseEther("3"),ethers.utils.parseEther("2")],['atr','bbbbb'],["20585761","20585761"]
    // );

    // // 确认订单
    // await order.connect(accounts[3]).confirmOrder("1",
    //   {
    //     value: ethers.utils.parseEther("5"),
    //   });

    // // 确认阶段
    // await order.connect(accounts[3]).confirmOrderStage("1",0);
    // // 终止阶段
    // await order.connect(accounts[3]).terminateStage("1",1);
  }

  main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });