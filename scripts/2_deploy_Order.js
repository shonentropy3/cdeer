

const hre = require("hardhat");
const { writeAbiAddr } = require('./artifact_log.js');

const TaskAddr = require(`../deployments/${hre.network.name}/DeTask.json`);
const WETHAddr = require(`../deployments/${hre.network.name}/WETH.json`);
const MetaCommonAddr = require(`../deployments/${hre.network.name}/MetaCommon.json`);
const VerifierAddr = require(`../deployments/${hre.network.name}/DeOrderVerifier.json`);


async function main() {
    await hre.run('compile');
    const [owner] = await hre.ethers.getSigners();




    const contractFactory = await hre.ethers.getContractFactory("DeOrder");

    // polygon
    // const order = await contractFactory.deploy(WETHAddr.address, "0x000000000022D473030F116dDEE9F6B43aC78BA3", VerifierAddr.address);

    // buildBear
    const order = await contractFactory.deploy(WETHAddr.address, "0x000000000022D473030F116dDEE9F6B43aC78BA3", VerifierAddr.address);

    await order.deployed();
    console.log("DeOrder deployed to:", order.address);

    let artifact = await artifacts.readArtifact("DeOrder");
    await writeAbiAddr(artifact, order.address, "DeOrder", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });