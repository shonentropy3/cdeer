

const hre = require("hardhat");
const { writeAbiAddr } = require('./artifact_log.js');

const TaskAddr = require(`../deployments/${hre.network.name}/DeTask.json`);
const WETHAddr = require(`../deployments/${hre.network.name}/WETH.json`);
const MetaCommonAddr = require(`../deployments/${hre.network.name}/MetaCommon.json`);


async function main() {
    await hre.run('compile');
    const [owner] = await hre.ethers.getSigners();

    const contractFactory = await hre.ethers.getContractFactory("DeOrderVerifier");
    const verifier = await contractFactory.deploy();

    await verifier.deployed();
    console.log("DeOrderVerifier deployed to:", verifier.address);

    let artifact = await artifacts.readArtifact("DeOrderVerifier");
    await writeAbiAddr(artifact, verifier.address, "DeOrderVerifier", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });