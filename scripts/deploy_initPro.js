const { ethers } = require("hardhat");
const hre = require("hardhat");
const taskJson = require('../deployments/mumbai/DeTask.json');
const orderJson = require('../deployments/mumbai/DeOrder.json');
const { abi } = require('../deployments/abi/DeTask.json');
const orderAbi = require('../deployments/abi/Order.json');
const rpcProvider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com");

let accounts = [];
let owner;

async function main() {
    await hre.run('compile');
    accounts = await ethers.getSigners();
    owner = accounts[0];
    // console.log(owner,"owner")
    const task = new ethers.Contract(taskJson.address, abi, owner);
    
    // console.log('rpcProvider ==>', rpcProvider);
    // console.log(task.methods.tokenURI(1).encodeABI());
    // await task.connect(owner).setOrder(orderJson.address);

    console.log('开始解析');
    const log = await rpcProvider.waitForTransaction('0xf137a6ff05c115fa607a4251eb6ad5d7063c076bf69415715207be5ac892b5e1')
    console.log('log ==> ', log);
    // console.log(owner.address,'============>');
    // //创建需求
    // await task.connect(accounts[3]).createTask(
    //   '0x5f2CC90663c2599c306984c43E7C93F7FD8E773e',
    //   {
    //     title: "test",
    //     desc: "desc",
    //     attachment: "",
    //     currency: 1,  //  币种,x10000,保留四位小数,前端只展示两位小数
    //     budget: 222,
    //     period: 123213,
    //     categories: 1,
    //     skills: 1,  //  原role,职业为1,2,3...整数型
    //   },
    //   {
    //       value: ethers.utils.parseEther("1"),
    //   }).then(res => {
    //     console.log(res);
    //   }).catch(err => {
    //     console.log('=====>>>>>>>>>>>',err);
    //   })


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