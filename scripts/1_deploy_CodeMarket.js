const hre = require("hardhat");
const { writeAbiAddr } = require('./artifact_log.js');

const { utils } = require("ethers");

async function main() {
    // await hre.run('compile');
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
    console.log("Contract deployed to:", contract.address);


    // Mint NFT by 
    txn = await contract.createProject({ 
            title: "test",
            price: 10,
            content: baseTokenURI,
            state: 0,
            time: 786942864435
             });
    await txn.wait()


    // View content
    viewContent = await contract.ownerOf(0);
    await txn.wait()
    console.log("content:",viewContent)

    // View content
    viewContent = await contract.ownerOf(0);
    await txn.wait()
    console.log("content:",viewContent)

    // // withdraw
    // withdrawMetamask = await contract.withdraw("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    // await txn.wait()


    

    


    // // Get all token IDs of the owner
    // let tokens = await contract.tokensOfOwner(owner.address)
    // console.log("Owner has tokens: ", tokens);

    let artifactT21 = await artifacts.readArtifact("CodeMarket");
    await writeAbiAddr(artifactT21, contract.address, "CodeMarket", network.name);
    // await writeAddr(contract.address, "CodeMarket", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });