const { ethers } = require("hardhat");
const hre = require("hardhat");
const taskJson = require('../deployments/mumbai/DeTask.json');
const orderJson = require('../deployments/mumbai/DeOrder.json');
const DeOrderSBTABI = require('../deployments/abi/DeOrderSBT.json');
const { abi: DetaskAbi } = require('../deployments/abi/DeTask.json');
const orderAbi = require('../deployments/abi/Order.json');
const rpcProvider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com");

let accounts = [];
let owner;

async function main() {
    await hre.run('compile');
    accounts = await ethers.getSigners();
    owner = accounts[0];
    // console.log(owner,"owner")
    // 0x6d48589ac36584d1862f06c1974eebffb1aa5d75 SVG OK
    const task = new ethers.Contract(taskJson.address, DetaskAbi, owner);



    
    // console.log('rpcProvider ==>', rpcProvider);
    // console.log(task.methods.tokenURI(1).encodeABI());
    // await task.connect(owner).setOrder(orderJson.address);

    // console.log('开始解析');
    // const log = await rpcProvider.waitForTransaction('0xf137a6ff05c115fa607a4251eb6ad5d7063c076bf69415715207be5ac892b5e1')
    // console.log('log ==> ', log);
    // console.log(owner.address,'============>');
    //创建需求
    await task.createTask(
      '0xada57585A768830a4c06D9A6e2314DF716426BB5',
      {
        title: "Create a new test task2",
        desc: "Task Desc",
        attachment: "QmSsw6EcnwEiTT9c4rnAGeSENvsJMepNHmbrgi2S9bXNJr",
        currency: 2,  //  
        budget: ethers.utils.parseEther("12.3"),
        period: 123213,
        skills: "50331650",  //  Skill 为1,2,3...整数型
        timestamp: 123213,
        disabled: false
      }
      ,
      {
        value: ethers.utils.parseEther("0"),
      }
      ).then(res => {
        console.log(res);
      }).catch(err => {
        console.log('=====>>>>>>>>>>>',err);
      })

    const uri = await task.tokenURI(1);
    console.log('URI:' + uri);


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