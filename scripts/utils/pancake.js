const { ethers, network } = require("hardhat");

const abis = require('./abis');

const erc20 = require('./erc20');

const FactoryAddr = require(`../../deployments/${network.name}/Factory.json`)
const RouterAddr = require(`../../deployments/${network.name}/Router.json`);



function getAbi(name) {
    if (abis[name]) return abis[name];

    let abi = require(`../../deployments/abi/${name}.json`)
    return abi;
}


// pancake
async function addLiquidate(account, token0, token1, amount0, amount1) {

    let pancakeRouter = await ethers.getContractAt(getAbi("PancakeRouter"), RouterAddr.address, account);
    let routerAddr = RouterAddr.address

    await erc20.balanceOf(token0, account.address);
    await erc20.balanceOf(token1, account.address);

    await erc20.approve(account, token0, routerAddr, ethers.constants.MaxUint256);
    await erc20.approve(account, token1, routerAddr, ethers.constants.MaxUint256);


    await erc20.allowance(token0, account.address, routerAddr);
    await erc20.allowance(token1, account.address, routerAddr);

    let tx = await pancakeRouter.addLiquidity(token0, token1, amount0, amount1, 0, 0, account.address, 9999999999);
    await tx.wait();

    let pancakeFactory = await ethers.getContractAt(getAbi("PancakeFactory"), FactoryAddr.address, ethers.provider);
    const pair = await pancakeFactory.getPair(token0, token1);
    console.log("pair address:" + pair);
    return pair;
}


async function removeLiquidity(account, token0Addr, token1Addr, pair, lpAmount) {
    let pancakeRouter = await ethers.getContractAt(getAbi("PancakeRouter"), RouterAddr.address, account);

    await erc20.approve(account, pair, pancakeRouter.address, ethers.constants.MaxUint256);

    let tx = await pancakeRouter.removeLiquidity(
        token0Addr,
        token1Addr,
        lpAmount,
        0, 0,
        account.address,
        9999999999
    )

    await tx.wait();
}

async function swapToken(account, fromTokenAddr, toTokenAddr, useAmount) {
    let pancakeRouter = await ethers.getContractAt(getAbi("PancakeRouter"), RouterAddr.address, account);

    await erc20.approve(account, fromTokenAddr, RouterAddr.address, ethers.constants.MaxUint256);

    let tx = await pancakeRouter.swapExactTokensForTokens(useAmount,
        0, [fromTokenAddr, toTokenAddr], account.address, 9999999999);

    await tx.wait();
}

async function swapTokenWithFee(account, fromTokenAddr, toTokenAddr, useAmount) {
    let pancakeRouter = await ethers.getContractAt(getAbi("PancakeRouter"), RouterAddr.address, account);

    await erc20.approve(account, fromTokenAddr, RouterAddr.address, ethers.constants.MaxUint256);

    let tx = await pancakeRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(useAmount,
        0, [fromTokenAddr, toTokenAddr], account.address, 9999999999);

    await tx.wait();
}


module.exports = {
    addLiquidate,
    removeLiquidity,
    swapToken,
    swapTokenWithFee
}