const hre = require("hardhat");
const { writeAbiAddr } = require('./artifact_log.js');

const TaskAddr = require(`../deployments/${hre.network.name}/DeTask.json`);

async function main() {
    await hre.run('compile');

    const [owner] = await hre.ethers.getSigners();

    const MetaCommon = await hre.ethers.getContractFactory("MetaCommon");
    const common = await MetaCommon.deploy();
    await common.deployed();


    const TaskMetadata = await hre.ethers.getContractFactory("TaskMetadata");

    // Deploy contract with the correct constructor arguments
    console.log("Order task:", TaskAddr.address);

    const metaData = await TaskMetadata.deploy(TaskAddr.address, common.address);
    await metaData.deployed();

    console.log("TaskMetadata deployed to:", metaData.address);
    let artifact = await artifacts.readArtifact("TaskMetadata");
    await writeAbiAddr(artifact, metaData.address, "TaskMetadata", network.name);

    const task = await hre.ethers.getContractAt("DeTask", TaskAddr.address);
    const tx = await task.setMetadataContract(metaData.address);
    await tx.wait();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });