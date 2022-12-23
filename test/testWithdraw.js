const { ethers, network } = require("hardhat");
const { expect } = require("chai");

const { getBalance } =  require("./../scripts/utils/block")

const DeOrderAddr = require(`../deployments/${network.name}/DeOrder.json`)
const DeStageAddr = require(`../deployments/${network.name}/DeStage.json`)
const IssuerSBTAddr = require(`../deployments/${network.name}/IssuerSBT.json`)
const BuilderSBTAddr = require(`../deployments/${network.name}/BuilderSBT.json`)

/** 
 * 测试用例：
 * 0 测试阶段金额与付款金额不匹配 （已验证）
 * 1. 测试未付款
 * 2. 测试多付了款, 并取去多余的金额
 * 3. 
 * 4. 
 */

// run testCreateOrder_Sign
describe("testWithdraw", function () {
  let DeOrder;
  let account1;
  let account2;
  let orderId;

  let IssuerSBT;
  let BuilderSBT;

  beforeEach(async function () {
    const accounts = await ethers.getSigners();
    account1 = accounts[0];
    account2 = accounts[1];
    
    console.log("account1:" + account1.address);
    console.log("account2:" + account2.address);

    DeOrder = await ethers.getContractAt("DeOrder", DeOrderAddr.address, account2);
    orderId = await DeOrder.currOrderId()
    console.log("orderId:" + orderId)

    DeStage = await ethers.getContractAt("DeStage", DeStageAddr.address, account2);


    IssuerSBT = await ethers.getContractAt("DeOrderSBT", IssuerSBTAddr.address, account2);
    BuilderSBT = await ethers.getContractAt("DeOrderSBT", BuilderSBTAddr.address, account2);

  });


  // it("test confirm Delivery" , async function (){
  //   let tx = await DeOrder.confirmDelivery(orderId, [0, 1]); 
  //   await tx.wait()
  //   console.log("confirmDelivery OK ");
  // })

  it("取款", async function () {
    let pending = await DeStage.pendingWithdraw(orderId);
    console.log("pending:", ethers.utils.formatUnits(pending[0]));

    let user2b1 = await getBalance(account2.address)
    console.log("取款前 乙余额 :", user2b1);

    tx = await DeOrder.withdraw(orderId, account2.address);
    await tx.wait();

    let user2b2 = await getBalance(account2.address)
    console.log("取款后 乙余额:", user2b2);

  });


  it("SBT", async function () {
    let tokenURI = await BuilderSBT.tokenURI(orderId);
    console.log("Builder tokenURI:", tokenURI);

    tokenURI = await IssuerSBT.tokenURI(orderId)
    console.log("IssuerSBT tokenURI:", tokenURI);

  });





});