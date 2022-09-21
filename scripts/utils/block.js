async function advanceBlock() {
    if (network.name === 'dev') {
        await ethers.provider.send('evm_mine');
    }
}

async function createSnapshot() {
    const snapshotId = await ethers.provider.send("evm_snapshot");
    return snapshotId;
}

async function revertSnapshot(snapshotId) {
    let isReverted
    if (network.name === 'dev') {
        isReverted = await ethers.provider.send("evm_revert", [snapshotId]);
    }
    return isReverted;
}

async function getBlock() {
    let block = await ethers.provider.getBlock()
    return block;
}

async function getBlockNum() {
    let num;
    let block = await ethers.provider.getBlock();
    if (block) {
        num = block.number;
    }
    return num;
}

async function getBalance(addr) {
    let balance = await ethers.provider.getBalance(addr);
    let etherString = ethers.utils.formatEther(balance);
    return etherString;
}

module.exports = {

    advanceBlock,
    createSnapshot,
    getBlock,
    getBlockNum,
    getBalance,
    revertSnapshot
}