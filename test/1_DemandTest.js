const { expect } = require("chai");
const { ethers } = require("hardhat");

let demand;
let order;
let accounts = [];
let owner;
let demandAddr;
let orderAddr = '';
let zeroAddr = ethers.constants.AddressZero;
let myToken;

const testHash = `QmSsw6EcnwEiTT9c4rnAGeSENvsJMepNHmbrgi2S9bXNJr`;

async function init() {
    accounts = await ethers.getSigners();
    owner = accounts[0];

    // Demand
    const Demand = await ethers.getContractFactory("Demand");
    demand = await Demand.deploy();
    await demand.deployed();
    demandAddr = demand.address;
  
    // Order
    const Order = await ethers.getContractFactory("Order");
    order = await Order.deploy(demandAddr);
    await order.deployed();
    orderAddr = order.address;
    // token
    await demand.connect(owner).setOrder(orderAddr);

    // Demand
    const MyERC20 = await ethers.getContractFactory("MyERC20");
    myToken = await MyERC20.deploy();
    await myToken.deployed();
    myToken = myToken.address;
    console.log({myToken: myToken});
  }

 function tokenAmount(value) {
    let tokenAmount = ethers.utils.parseEther(value);
    return tokenAmount;
}

describe("Demand", function() {
    before(async function () {
        await init();
        console.log(orderAddr);
      });
    /* 
        2. 发布需求 createDemand
        2.1 手续费不低于设置值 
    */
    it("createDemand", async function() {
        // createDemand
        await demand.connect(accounts[1]).createDemand(
            { 
                title: "test",
                desc: testHash,
                attachment: testHash,
                budget: tokenAmount("1000"),
                period: 1
            },
            {
                value: tokenAmount("1"),
            });
    });
     /* 
        3. 修改需求 modifyDemand
            3.1 非发布者不能修改
            3.2 需求已经存在生效订单，则不能修改
    */
    it("modifyDemand", async function(){
        await demand.connect(accounts[1]).modifyDemand(0, 
            { 
                title: "test",
                budget: tokenAmount("1000"),
                desc: testHash,
                attachment: testHash,
                period: 786942864435
            });
    });
     /* 
        4. 报名需求 applyFor
            4.1 非发布者本人不能报名
            4.2 该需求已经存在生效订单，还能报名该需求
            4.3 已经报名该需求不能报名
        5. 取消报名 cancelApplyFor
            5.1 不能取消非自己报名需求
        6. 甲方开启报名开关 openApply
            6.1 非本人不能开启
            6.2 已经开启不再开启
        7. 甲方关闭报名开关 cancelApplyFor
            7.1 非本人不能关闭
            7.2 已经关闭不再关闭
    */
    it("applyFor", async function(){
        await demand.connect(accounts[2]).applyFor(0);
        await demand.connect(accounts[2]).cancelApply(0);
        await demand.connect(accounts[1]).closeApply(0);
        await demand.connect(accounts[1]).openApply(0);
        await demand.connect(accounts[2]).applyFor(0);
    });

    it("modifyFee", async function(){
        await demand.connect(owner).modifyFee(1);
    });
});

describe("Order", function() {
    before(async function () {
        await init();
        await demand.connect(accounts[1]).createDemand(
            { 
                title: "test",
                desc: testHash,
                attachment: testHash,
                budget: tokenAmount("1000"),
                period: 1
            },
            {
                value: tokenAmount("0.1")
            });
      });

    /* 
        1. 甲方创建订单 createOrder
            1.1 甲方必须是需求方本人
            1.2 乙方不能是零地址
    */
    it("createOrder", async function() {

        await order.connect(accounts[1]).createOrder(
            {
                demandId: 0,
                applyAddr: accounts[2].address,
                token: zeroAddr,
                amount: tokenAmount("1000"),
                confirmed: 0,
                startDate: 0
            });
    });

    /*
        2. 乙方设置阶段参数 setStageByB
            2.1 订单地址是乙方本人才能设置
            2.2 该订单甲方确认后不能进行设置阶段
            2.3 订单甲方拒绝之后，乙方不能设置
            2.4 乙方设置阶段
                a. 设置阶段数不能超过初始最大阶段数（管理员可以设置最大阶段数）
                b. 设置的阶段中总金额需要等于订单显示金额
            2.5 订单初始时间改为乙方确认时间，并且每阶段结束时间要延后
                延后时间 = 乙方确认时间 - 甲方确认时间
    */
    it("setStageByB", async function() {
        await order.connect(accounts[2]).setStageByB(
            0,
            zeroAddr,
            [tokenAmount("997"),tokenAmount("1"),tokenAmount("2")],
            [1657013307, 1657099707, 1657186107]
            );
        });

    /*
        3. 甲方确认订单 confirmOrder
            3.1 确认订单时打入项目款
                a. token和coin都支持
                b. 打入款金额等于订单显示金额，且等于阶段总金额
            3.2 非订单本人不能确认
            3.3 订单需要被乙方初次确认，且设置了阶段数后才能确认
            3.4 甲方确认，订单初始时间为甲方确认时间，并且每阶段结束时间要延后
                延后时间 = 甲方再次确认时间 - 乙方确认时间
            3.5 若有预付款
                a. 甲方确认时，直接确认第一阶段交付之后，乙方个人可以进行提款，预付款相当于第一阶段交付
            3.6 同一个需求订单数量不能超过maxDemandOrders（最大需求订单数量，管理员可以设置）
    */
    it("confirmOrder", async function() {
        await order.connect(accounts[1]).confirmOrder(0,
            {
                value: tokenAmount("1000")
            });
        console.log({B: await accounts[2].getBalance("latest")});
        });

    /*
        4. 甲方确认交付阶段 confirmOrderStage
            4.1 非甲方本人不能确认，已经提款不能确认，已经确认后无需确认
    */
    it("confirmOrderStage", async function() {
        await order.connect(accounts[1]).confirmOrderStage(0,1);
        });

    /*
        5. 终止订单 terminateOrder
            5.1 终止订单只允许甲乙两人
            5.2 订单不能被确认
            5.3 终止订单后，将项目款全部打给甲方
            5.4 订单终止后，订单数据清除，不能找到订单信息
    */
    // it("terminateOrder", async function() {
    //     await order.connect(accounts[1]).terminateOrder(0);
    //     });

    /*
    6. 终止阶段 terminateStage
        6.1 终止阶段只允许甲乙两人，需终止的阶段不能被确认
        6.2 终止的阶段须是当下时间阶段
            a. 当下时间点是在终止阶段的开始时间至该阶段的结束时间之间
            b. 第一阶段的开始时间是订单的开始时间
            c. 非第一阶段的开始时间是上一阶段的结束时间
        6.3 该终止阶段乙方获取的金额
            a. 乙方该阶段获取的金额 =（（当下时间 - 该阶段开始时间）/ 该阶段周期）*该阶段项目总金额
            b. 甲方剩余项目款 = 该阶段项目总金额 - 乙方该阶段获取的金额 + 该阶段之后的所有阶段总金额
        6.4 阶段终止后，将乙方该阶段获取的金额，甲方剩余项目款分别打给甲乙
            a. 打款根据甲方最初打入的coin和token的方式打款
            b. 打款之后要设置已经提款，包括该阶段之后的阶段
            c. 该阶段之前的阶段，若未提款，乙方单独自行提款
    */
    it("terminateStage", async function() {
        await order.connect(accounts[1]).terminateStage(0,0);
        console.log({A: await accounts[1].getBalance("latest")});
        console.log({B: await accounts[2].getBalance("latest")});
        });

    /*
    7. 乙方提款 withdrawByB
        7.1 非乙方本人不能提款
        7.2 该阶段之前未提款
        7.3 提款
            a. 甲方确认该阶段可以提款
            b. 甲方确认该订单后未终止该阶段，且现在时间已经超过该阶段终止时间的后七天，允许提款
    */
    it("withdrawByB", async function() {
        await order.connect(accounts[2]).withdrawByB(0,0);
        console.log({A: await accounts[1].getBalance("latest")});
        console.log({B: await accounts[2].getBalance("latest")});
        });

    /*
    8. 作为外部接口，订单是否已经接单 isConfirmOrders
    */
    it("isDemandOrders", async function() {

        // await order.connect(accounts[2]).setStageByB(
        //     0,
        //     zeroAddr,
        //     [tokenAmount("1"),tokenAmount("1"),tokenAmount("8")],
        //     [1657013307, 1657099707, 1657186107]
        //     );

        // await order.connect(accounts[1]).terminateStage(0,0);
        console.log({A: await accounts[1].getBalance("latest")});
        console.log({B: await accounts[2].getBalance("latest")});
        
        let active = await order.connect(accounts[1]).isDemandOrders(0);
        expect(active).to.equal(true);
        console.log({A: await accounts[1].getBalance("latest")});
        console.log({B: await accounts[2].getBalance("latest")});
        });
    
    /*
    9. 管理员
        1）修改允许最大阶段数 modifyMaxStages
        2）修改同一需求最大订单数量 modifyMaxDemandOrders
    */
    it("modifyMaxStages", async function() {
        await order.connect(owner).modifyMaxStages(1);
        // await order.connect(accounts[2]).setStageByB(
        //     0,
        //     zeroAddr,
        //     [tokenAmount("1"),tokenAmount("1"),tokenAmount("8")],
        //     [1657013307, 1657099707, 1657186107]
        //     );
        });

});