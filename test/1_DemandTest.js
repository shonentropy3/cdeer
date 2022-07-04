

const { demandAddr, address} = require('../deployments/dev/Demand.json');
const demandAbi = require('../deployments/abi/Demand.json').abi;
const { ethereum } = window;
const hre = require("hardhat");
const { expect } = require("chai");
const { ethers } = require("hardhat");

async function main() {
    await hre.run('compile');

    const [deployer,deployer1] = await ethers.getSigners();
    console.log("deployer address", deployer);
    // deployer = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const baseTokenURI = `QmSsw6EcnwEiTT9c4rnAGeSENvsJMepNHmbrgi2S9bXNJr`;

    demand = new ethers.Contract(demandAddr, 
        demandAbi, deployer);

    demand.setOrder(address(this));

    if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress.address, abi, signer);
    }

   // CreateDemand
    createDemand = await contract.createDemand(
        { 
            title: "test",
            desc: baseTokenURI,
            attachment: baseTokenURI,
            budget: 10,
            period: 786942864435
        },
        {
            value: 10000000000
        });
    await createDemand.wait()

    // modifyProject
    modifyDemand = await demand.modifyDemand(0, 
        { 
            title: "test",
            desc: baseTokenURI,
            attachment: baseTokenURI,
            budget: 10,
            period: 786942864435
        }
        );
    await modifyDemand.wait()

    let c = await demand.demand();
    console.log("----->"+c.toString());
    expect(c.toString()).to.equal("1");

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
