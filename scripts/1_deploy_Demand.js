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
    const contractFactory = await hre.ethers.getContractFactory("Demand");
    // Deploy contract with the correct constructor arguments
    const contract = await contractFactory.deploy();
    // Wait for this transaction to be mined
    await contract.deployed();
    // Get contract address
    console.log("Demand deployed to:", contract.address);
    console.log("Owner address:", await contract.owner());

    let artifactT21 = await artifacts.readArtifact("Demand");
    demand = new ethers.Contract(contract.address, 
        artifactT21.abi, deployer);
    await writeAbiAddr(artifactT21, contract.address, "Demand", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });