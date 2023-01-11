const { network, ethers } = require("hardhat");

const dUSDTAddr = require(`../deployments/${hre.network.name}/dUSDT.json`)


describe("testCreateTask", function () {
    let account1
    beforeEach(async function () {
        const accounts = await ethers.getSigners();
        account1 = accounts[0];
        
        dUSDT = await ethers.getContractAt("dUSDT", dUSDTAddr.address, account1);
    
        console.log("dUSDT ==>",dUSDT);
      });

      it("transfer", async function () {
    
        // let tx =await dUSDT.transfer("0xBc29e77D98C9CEDE3B4FDf83C57D92d03EB608B4",100000000);
        // tx.wait();
        let tx =await dUSDT.balanceOf("0xBc29e77D98C9CEDE3B4FDf83C57D92d03EB608B4");
        // tx.wait();
        console.log(tx);
        
    
      });
});