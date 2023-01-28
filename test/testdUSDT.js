const { network, ethers } = require("hardhat");

const dUSDTAddr = require(`../deployments/${hre.network.name}/dUSDT.json`)


describe("testCreateTask", function () {
    let account1
    beforeEach(async function () {
        const accounts = await ethers.getSigners();
        account1 = accounts[0];
        
        dUSDT = await ethers.getContractAt("dUSDT", dUSDTAddr.address, account1);
        let order = await ethers.provider.getBalance("0xB7A2987CAb7CD605A6215f2a4eBd117ee3d3E3E3");
        console.log(order);
        // console.log("dUSDT ==>",dUSDT);
      });

      it("transfer", async function () {
    
        // let tx =await dUSDT.transfer("0xB7A2987CAb7CD605A6215f2a4eBd117ee3d3E3E3",100000000);
        // tx.wait();
        let balanceof =await dUSDT.balanceOf("0xB7A2987CAb7CD605A6215f2a4eBd117ee3d3E3E3");
        // tx.wait();
        console.log(balanceof);
        
    
      });
});