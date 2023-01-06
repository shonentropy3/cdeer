

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


    let tx = await order.setSupportToken("0x522981BEF10d0906935FB7747d9aE3bC1189e3A4",true);
    await tx.wait();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });