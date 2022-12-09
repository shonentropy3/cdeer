const { ethers, network } = require("hardhat");
const { expect } = require("chai");
const { signPermitStage, signPermitProlongStage } = require("./signPermitStage.js");

const DeOrderAddr = require(`../deployments/${network.name}/DeOrder.json`)
const WETHAddr = require(`../deployments/${network.name}/WETH.json`)
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
  let weth;

  beforeEach(async function () {
    const accounts = await ethers.getSigners();
    account1 = accounts[0];
    account2 = accounts[1];
    
    console.log("account1:" + account1.address);
    console.log("account2:" + account2.address);

    DeOrder = await ethers.getContractAt("DeOrder", DeOrderAddr.address, account1);

    weth = await ethers.getContractAt("WETH", WETHAddr.address, account1);

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

    let b = await weth.balanceOf(DeOrder.address);
    console.log("weth balance:", b.toString())

    let order = await DeOrder.getOrder(orderId);
    console.log("order.amount", order.amount.toString())
    console.log("order.payed", order.payed.toString())

    tx = await DeOrder.startOrder(orderId);
    await tx.wait();

  });

  it("signPermitProlongStage", async function () {
    let { chainId } = await ethers.provider.getNetwork();
    let nonce = await DeOrder.nonces(account2.address);  // get from  
    console.log("nonce:" + nonce)

    let period = "36000" 
    let deadline = "99999999999"

    const sig = await signPermitProlongStage(
      chainId,
      DeOrderAddr.address,
      account2,
      orderId,
      1,
      period,
      nonce,  
      deadline,
    );

      //  椭圆曲线签名签名的值:
      // r = 签名的前 32 字节
      // s = 签名的第2个32 字节
      // v = 签名的最后一个字节

      console.log("sig:", sig);
      let r = '0x' + sig.substring(2).substring(0, 64);
      let s = '0x' + sig.substring(2).substring(64, 128);
      let v = '0x' + sig.substring(2).substring(128, 130);
      
      
    await DeOrder.prolongStage(orderId, 1 , period, nonce, deadline, v, r, s);
    console.log("prolongStage OK ");

  });

  // it("取出多余的款， 无法多取", async function () {
  //   await expect(DeOrder.refund(orderId, account1.address, 100)).to.be.revertedWith('AmountError(1)');
  // });

  // it("取出多余的款，刚好取完", async function () {
  //   let tx = await DeOrder.refund(orderId, account1.address, 10);
  //   await tx.wait();
  // });



});
