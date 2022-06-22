const hre = require("hardhat");
const { writeAbiAddr } = require('./artifact_log.js');
const { utils } = require("ethers");

async function main() {
    await hre.run('compile');
    const [deployer,deployer1] = await ethers.getSigners();
    const baseTokenURI = `QmSsw6EcnwEiTT9c4rnAGeSENvsJMepNHmbrgi2S9bXNJr`;

    // Get owner/deployer's wallet address
    const [owner] = await hre.ethers.getSigners();
    // Get contract that we want to deploy
    const contractFactory = await hre.ethers.getContractFactory("CodeMarket");
    // Deploy contract with the correct constructor arguments
    const contract = await contractFactory.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    // Wait for this transaction to be mined
    await contract.deployed();
    // Get contract address
    console.log("CodeMarket deployed to:", contract.address);

    // Mint NFT by 
    txn = await contract.createProject(
        { 
            title: "test",
            budget: 10,
            content: baseTokenURI,
            period: 786942864435
             },
             {
                 value: 10000000000
             });
    await txn.wait()

    // modifyStatus = await contract.modifyStatus(0,1);
    // await modifyState.wait() 

    // stateNow = await contract._state(0);
    // console.log("now",stateNow)


    let artifactT21 = await artifacts.readArtifact("CodeMarket");
    await writeAbiAddr(artifactT21, contract.address, "CodeMarket", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });