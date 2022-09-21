const { ethers } = require("hardhat");
const { expect } = require("chai");
const { signPermitStage } = require("./signPermitStage.js");

const DeOrderAddr = require(`../deployments/dev/DeOrder.json`)
/** 
 * 测试用例：
 * 0 测试阶段金额与付款金额不匹配 （已验证）
 * 1. 测试未付款
 * 2. 测试多付了款, 并取去多余的金额
 * 3. 
 * 4. 
 */

// run testCreateOrder_Sign
describe("testStartOrder", function () {
  let DeOrder;
  let account1;
  let account2;
  let orderId;

  beforeEach(async function () {
    const accounts = await ethers.getSigners();
    account1 = accounts[0];
    account2 = accounts[1];
    
    console.log("account1:" + account1.address);
    console.log("account2:" + account2.address);

    DeOrder = await ethers.getContractAt("DeOrder", DeOrderAddr.address, account1);
    orderId = await DeOrder.currOrderId()
    console.log("orderId:" + orderId)

  });


  it("测试未付款 应该无法开始订单 ", async function () {
    await expect(DeOrder.startOrder(orderId)).to.be.revertedWith('AmountError(1)');
  });

  it("测试付款，开始订单", async function () {
    let amount = ethers.utils.parseEther("1")
    let tx = await DeOrder.payOrder(orderId, amount, {value: amount});
    await tx.wait();

    let order = await DeOrder.getOrder(orderId);
    console.log("order.amount", order.amount.toString())
    console.log("order.payed", order.payed.toString())

    tx = await DeOrder.startOrder(orderId);
    await tx.wait();

  });

  // it("取出多余的款， 无法多取", async function () {
  //   await expect(DeOrder.refund(orderId, account1.address, 100)).to.be.revertedWith('AmountError(1)');
  // });

  // it("取出多余的款，刚好取完", async function () {
  //   let tx = await DeOrder.refund(orderId, account1.address, 10);
  //   await tx.wait();
  // });



});
