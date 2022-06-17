const hre = require("hardhat");
const { writeAbiAddr } = require('./artifact_log.js');
const { utils } = require("ethers");

async function main() {
    await hre.run('compile');
    const [deployer,deployer1] = await ethers.getSigners();
    const baseTokenURI = "ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/";
    // Get owner/deployer's wallet address
    const [owner] = await hre.ethers.getSigners();
    // Get contract that we want to deploy
    const contractFactory = await hre.ethers.getContractFactory("CodeMarket");
    // Deploy contract with the correct constructor arguments
    const contract = await contractFactory.deploy();
    // Wait for this transaction to be mined
    await contract.deployed();
    // Get contract address
    console.log("CodeMarket deployed to:", contract.address);

    // Mint NFT by 
    txn = await contract.createProject({ 
            title: "test",
            price: 10,
            content: baseTokenURI,
            time: 786942864435
             });
    await txn.wait()


    state = await contract._state(0);
    console.log("old",state)

    tokensAmount = await contract.tokensAmount("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    console.log("tokensAmount",tokensAmount)

    modifyState = await contract.modifyState(0,1);
    await modifyState.wait() 

    stateNow = await contract._state(0);
    console.log("now",stateNow)


    let artifactT21 = await artifacts.readArtifact("CodeMarket");
    await writeAbiAddr(artifactT21, contract.address, "CodeMarket", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });