const { ethers, network } = require("hardhat");
const { expect } = require("chai");
const { signPermit2 } = require("./signPermit2.js");

const permit2Addr = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

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
  let account1;
  let account2;
  let Permi2;

  beforeEach(async function () {
    const accounts = await ethers.getSigners();
    account1 = accounts[0];
    account2 = accounts[1];
    
    console.log("account1:" + account1.address);
    console.log("account2:" + account2.address);

    Permi2 = await ethers.getContractAt("IPermit2", permit2Addr, account1);

    console.log("Permi2:" + Permi2)

  });

  it("signPermit2", async function () {
    let { chainId } = await ethers.provider.getNetwork();
    let nonce = 0;  // get from  
    console.log("nonce:" + nonce)

    let deadline = "99999999999"
    let spender = "0xffffffffffffffffffffffffffffffffffffffff"
    let token = "0x522981BEF10d0906935FB7747d9aE3bC1189e3A4"


    const sig = await signPermit2(
        chainId,
        "0x000000000022D473030F116dDEE9F6B43aC78BA3",
        account1,
        token,
        0,
        spender,
        nonce,
        deadline,
    );

      //  椭圆曲线签名签名的值:
      // r = 签名的前 32 字节
      // s = 签名的第2个32 字节
      // v = 签名的最后一个字节

      console.log("sig:", sig);
    //   let r = '0x' + sig.substring(2).substring(0, 64);
    //   let s = '0x' + sig.substring(2).substring(64, 128);
    //   let v = '0x' + sig.substring(2).substring(128, 130);

    let tx = await Permi2.permitTransferFrom(
        {
            permitted: {
                token: token,
                amount: 0
            },
            nonce: nonce,
            deadline: deadline
        },
        {
            to: account2.address,
            requestedAmount: 0
        },
        account1.address,
        sig
    )
    await tx.wait();
  });

});
