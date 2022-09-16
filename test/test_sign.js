const { ethers } = require("hardhat");
// const { expect } = require("chai");
const { signPermitStage } = require("./signPermitStage.js");

const DeOrderAddr = require(`../deployments/dev/DeOrder.json`)

// const { expectRevert } = require("@openzeppelin/test-helpers");




describe("Token", function () {
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
    
  });

  it("createOrder", async function () {
    let currOrderId = await DeOrder.currOrderId();

    let tx = await DeOrder.createOrder(0, 
      account1.address,
      account2.address, 
      ethers.constants.AddressZero, 10000);
    
    await tx.wait();

    orderId = await DeOrder.currOrderId()
    console.log("orderId:" + orderId)
    // expect(orderId).to.equal(currOrderId + 1 );

  });

  it("signPermitStage", async function () {
    let { chainId } = await ethers.provider.getNetwork();
    let nonce = await DeOrder.nonces(account2.address);  // get from  
    console.log("nonce:" + nonce)

    let amounts = ["1"]
    let periods = ["1"] 
    let deadline = "99999999999"

    const sig = await signPermitStage(
      chainId,
      DeOrderAddr.address,
      account2,
      orderId,
      amounts,
      periods,
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

    await DeOrder.permitStage(orderId,amounts,periods,nonce, deadline, v, r, s);
    // let signer = await DeOrder.testPermitStage(orderId,amounts,periods,nonce, deadline, v, r, s);
    // console.log("signer:", signer);

  });


});
