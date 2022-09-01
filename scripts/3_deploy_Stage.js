

const hre = require("hardhat");
const { writeAbiAddr } = require('./artifact_log.js');

const DeOrderAddr = require(`../deployments/${hre.network.name}/DeOrder.json`);

async function main() {
    await hre.run('compile');
    const [owner] = await hre.ethers.getSigners();

    const contractFactory = await hre.ethers.getContractFactory("DeStage");

    const stage = await contractFactory.deploy(DeOrderAddr.address);

    await stage.deployed();
    console.log("DeStage deployed to:", stage.address);

    let artifact = await artifacts.readArtifact("DeStage");
    await writeAbiAddr(artifact, stage.address, "DeStage", network.name);

    const order = await ethers.getContractAt("DeOrder",
        DeOrderAddr.address,
        owner);
    
    let tx = await order.setDeStage(stage.address);
    await tx.wait();

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });