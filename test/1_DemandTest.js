const { expect } = require("chai");
const { ethers } = require("hardhat");

let demand;
let order;
let accounts = [];
let owner;
let demandAddr;
let orderAddr = ''

const testHash = `QmSsw6EcnwEiTT9c4rnAGeSENvsJMepNHmbrgi2S9bXNJr`;

async function init() {
    accounts = await ethers.getSigners();
    owner = accounts[0];

    // Demand
    const Demand = await ethers.getContractFactory("Demand");
    demand = await Demand.deploy();
    await demand.deployed();
    demandAddr = demand.address.toLowerCase();
  
    // Order
    const Order = await ethers.getContractFactory("Order");
    order = await Order.deploy(demandAddr);
    orderAddr = order.address;
    await order.deployed();

    await demand.connect(owner).setOrder(orderAddr);
  }

async function tokenAmount(value) {
    let tokenAmount = ethers.utils.parseEther(value);
    return tokenAmount;
}
describe("Demand", function() {
    before(async function () {
        await init();
      });

  it("createDemand", async function() {
    // createDemand
    await demand.connect(accounts[1]).createDemand(
        { 
            title: "test",
            desc: testHash,
            attachment: testHash,
            budget: 10,
            period: 1
        },
        {
            value: 10000000000
        });
  });

    it("modifyDemand", async function(){
            await demand.connect(accounts[1]).modifyDemand(0, 
                { 
                    title: "test",
                    budget: 10,
                    desc: testHash,
                    attachment: testHash,
                    period: 786942864435
                });
    });
    
    it("applyFor", async function(){
        await demand.connect(owner).applyFor(0);
        await demand.connect(owner).cancelApplyFor(0);
        await demand.connect(owner).applyFor(0);
    });

    it("modifyFee", async function(){
        await demand.connect(owner).modifyFee(1);
    });
});

describe("Order", function() {
    before(async function () {
        await init();
      });

    // it("createDemand", async function() {
    //     await order.connect(accounts[1]).createOrder(0,
    //         {
    //             proId: "test",
    //             applyAddr: testHash,
    //             token: testHash,
    //             amount: tokenAmount("10"),
    //             confirmed: 1,
    //             startDate: 0
    //         },
    //         accounts[1].address,
    //         [tokenAmount("1"),tokenAmount("1"),tokenAmount("1")],
    //         [1,2,3]
    //     );
    // });

});