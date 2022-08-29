const { ethers } = require("hardhat");
const { signPermitStage } = require("./signPermitStage.js");

// const { expectRevert } = require("@openzeppelin/test-helpers");


describe("Token", function () {
  let contract;
  let owner;

  beforeEach(async function () {
    const accounts = await ethers.getSigners();
    owner = accounts[0];
    console.log("owner:" + owner.address);

    const Order = await ethers.getContractFactory("Order");
    contract = await Order.deploy("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    await contract.deployed();
  });

  it("Should Passed", async function () {
    let { chainId } = await ethers.provider.getNetwork();
    let orderId = "1" 
    let amounts = ["1"]
    let periods = ["1"] 
    let deadline = "99999999999"
    const sig = await signPermitStage(
      chainId,
      contract.address,
      owner,
      orderId,
      amounts,
      periods,
      deadline,
    );

      //  椭圆曲线签名签名的值:
      // r = 签名的前 32 字节
      // s = 签名的第2个32 字节
      // v = 签名的最后一个字节

      console.log(sig);

      let r = '0x' + sig.substring(2).substring(0, 64);
      let s = '0x' + sig.substring(2).substring(64, 128);
      let v = '0x' + sig.substring(2).substring(128, 130);

    await contract.permitStage(orderId,amounts,periods, deadline, v, r, s);
  });

  // it("Should not allow minting if whitelist is not enabled in the contract (missing whitelist address in contract)", async function () {
  //   let { chainId } = await ethers.provider.getNetwork();
  //   const sig = signPermitStage(
  //     chainId,
  //     contract.address,
  //     whitelistKey,
  //     mintingKey.address
  //   );
  //   await expectRevert(contract.whitelistMint(sig), "whitelist not enabled");
  // });

});