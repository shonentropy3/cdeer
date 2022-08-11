

const hre = require("hardhat");
const { writeAbiAddr } = require('./artifact_log.js');

const TaskAddr = require(`../deployments/${hre.network.name}/Task.json`);

async function main() {
    await hre.run('compile');
    const [owner] = await hre.ethers.getSigners();

    const contractFactory = await hre.ethers.getContractFactory("Order");

    console.log("task address:", TaskAddr.address);
    const order = await contractFactory.deploy(TaskAddr.address);

    await order.deployed();
    console.log("Order deployed to:", order.address);

    let artifact = await artifacts.readArtifact("Order");
    await writeAbiAddr(artifact, order.address, "Order", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });