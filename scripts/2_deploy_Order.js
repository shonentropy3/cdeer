

const hre = require("hardhat");
const { writeAbiAddr } = require('./artifact_log.js');

const TaskAddr = require(`../deployments/${hre.network.name}/DeTask.json`);
const WETHAddr = require(`../deployments/${hre.network.name}/WETH.json`);
const MetaCommonAddr = require(`../deployments/${hre.network.name}/MetaCommon.json`);


async function main() {
    await hre.run('compile');
    const [owner] = await hre.ethers.getSigners();

    const contractFactory = await hre.ethers.getContractFactory("DeOrder");

    const order = await contractFactory.deploy(WETHAddr.address);

    await order.deployed();
    console.log("DeOrder deployed to:", order.address);

    let artifact = await artifacts.readArtifact("DeOrder");
    await writeAbiAddr(artifact, order.address, "DeOrder", network.name);


    const DeOrderSBTFactory = await hre.ethers.getContractFactory("DeOrderSBT");
    const builderSBT = await DeOrderSBTFactory.deploy(order.address, "Detask Builder SBT", "DBuilder");
    await builderSBT.deployed();
    let orderSBTArtifact = await artifacts.readArtifact("DeOrderSBT");
    await writeAbiAddr(orderSBTArtifact, builderSBT.address, "BuilderSBT", network.name);

    const BuilderMetadataFactory = await hre.ethers.getContractFactory("BuilderMetadata");
    const builderMeta = await BuilderMetadataFactory.deploy(TaskAddr.address, 
            order.address, MetaCommonAddr.address);
    await builderMeta.deployed();

    let tx = await builderSBT.setMetaContract(builderMeta.address);
    await tx.wait();

    const issuerSBT = await DeOrderSBTFactory.deploy(order.address, "Detask Issuer SBT", "DIssuer");
    await issuerSBT.deployed();
    await writeAbiAddr(orderSBTArtifact, issuerSBT.address, "IssuerSBT", network.name);

    const IssuerMetadataFactory = await hre.ethers.getContractFactory("IssuerMetadata");
    const issuerMeta = await IssuerMetadataFactory.deploy(TaskAddr.address, 
            order.address, MetaCommonAddr.address);
    await issuerMeta.deployed();

    tx = await issuerSBT.setMetaContract(issuerMeta.address);
    await tx.wait();

    tx = await order.setSBT(builderSBT.address, issuerSBT.address);
    await tx.wait();




}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });