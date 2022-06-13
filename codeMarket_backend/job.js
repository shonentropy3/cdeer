// import USDR_ADDR from './deployments/ERC721Demo.json';
const USDR_ADDR = require('./deployments/ERC721Demo.json');
const logger = require('./logger');
const dbUtil = require('./dbUtil');
const { ethers, network } = require("hardhat");
const { rpcProvider } = require('./provider');
const { forEach } = require('./router');
// const USDR_ADDR = process.env.USDR_ADDR;


async function insertLog() {
    logger.debug('getLogs');

    if (global.lock_get_logs) return;

    global.lock_get_logs = 1;

    await _insertLog();

    global.lock_get_logs = 0;
}

//监听
async function _insertLog() {
    let latest = await rpcProvider.getBlockNumber();
    let last_check_block = await dbUtil.getLastCheckBlock();
    if (last_check_block >= latest) return; //区块已监听过了

    last_check_block = Math.max(last_check_block, (latest - 100)); //最多往前100区块
    let fromBlock = last_check_block + 1;
    let toBlock = latest;
    let filter = {
        // 指定监听地址和事件
        address: USDR_ADDR.address,
        // address: "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F",
        topics: [
        // 和topic一样
            ethers.utils.id("CreateProject(address,uint256,string,uint256,string,uint8,uint256)")
        ],
        fromBlock,
        toBlock
    }
    let logs = await rpcProvider.getLogs(filter);
    const CreatProjectEvent = new ethers.utils.Interface(["event CreateProject(address indexed msgSenderAdddress, uint256 indexed tokenId, string title, uint256 price,string content, uint8 state, uint256 time)"]);
    if (logs.length > 0) {
        let txs = logs.map(ele => {
            let decodedData = CreatProjectEvent.parseLog(ele);
            return {
                msgSenderAdddress: decodedData.args.msgSenderAdddress,
                tokenId: decodedData.args.tokenId,
                title: decodedData.args.title,
                price: decodedData.args.price,
                content: decodedData.args.content,
                state: decodedData.args.state,
                time: decodedData.args.time,
            }
        });
        let value = ``;
        for (const v of txs) {
            value += `('${v.msgSenderAdddress}',${v.tokenId},'${v.title}',${v.price},'${v.content}',${v.state},now()),`
        }
        await dbUtil.insertPro(value.substring(0,(value.length-1))); // 写入数据库
        // console.log("insert tokenId: ", (value))
         // 更新监听区块号
        await dbUtil.updateLastCheckBlock(latest);
    }
}


module.exports = {
    insertLog,
};