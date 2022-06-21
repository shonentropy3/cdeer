// import USDR_ADDR from './deployments/CodeMarket.json';
const USDR_ADDR = require('../../../deployments/CodeMarket.json');
const logger = require('../../com/logger');
const dbUtil = require('../../db/dbUtil');
const { ethers, network } = require("hardhat");
const { rpcProvider } = require('../../com/provider');


async function insertLog() {
    logger.debug('getLogs');
    if (global.lock_get_logs) return;
    global.lock_get_logs = 1;
    await _insertLog();
    global.lock_get_logs = 0;
}

    // 存入mintNFT日志信息
    async function _insertLog() {
        let latest = await rpcProvider.getBlockNumber();
        let last_check_block = await dbUtil.getLastCheckBlock();
        if (last_check_block >= latest) return; //区块已监听过了
        last_check_block = Math.max(last_check_block, (latest - 100)); //最多往前100区块
        let fromBlock = last_check_block + 1;
        let toBlock = latest;
        let filter = {
            address: USDR_ADDR.address,
            topics: [
                ethers.utils.id("CreateProject(address,uint256,string,uint256,string,uint256)")
            ],
            fromBlock,
            toBlock
        }
        let logs = await rpcProvider.getLogs(filter);
        const CreatProjectEvent = new ethers.utils.Interface(["event CreateProject(address indexed msgSenderAdddress, uint256 indexed tokenId, string title, uint256 budget, string content, uint256 period)"]);
        if (logs.length > 0) {
            let txs = logs.map(ele => {
                let decodedData = CreatProjectEvent.parseLog(ele);
                return {
                    msgSenderAdddress: decodedData.args.msgSenderAdddress,
                    tokenId: decodedData.args.tokenId,
                    title: decodedData.args.title,
                    budget: decodedData.args.budget,
                    content: decodedData.args.content,
                    period: decodedData.args.period,
                }
            });
            let value = ``;
            for (const v of txs) {
                value += `
                ('${v.msgSenderAdddress}',${v.tokenId},'${v.title}',${v.budget},'${v.content}'),
                `
            }
            let result = await dbUtil.insertPro(value.substring(0,(value.length-1))); 
            if (-1 != result) {
                await dbUtil.updateLastCheckBlock(latest);   
            }
        }
    }


module.exports = {
    insertLog,
};