// import USDR_ADDR from './deployments/Demand.json';
const USDR_ADDR = require('../../deployments/Demand.json');
const logger = require('../com/logger');
const dbUtil = require('../db/dbUtil');
const { ethers, network } = require("hardhat");
const { rpcProvider } = require('../com/provider');


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
        const CreatProjectEvent = new ethers.utils.Interface(["event CreateProject(address indexed user, uint256 indexed tokenId, string title, uint256 budget, string desc, uint256 period)"]);
        if (logs.length > 0) {
            let txs = logs.map(ele => {
                let decodedData = CreatProjectEvent.parseLog(ele);
                return {
                    msgSenderAdddress: decodedData.args.msgSenderAdddress,
                    tokenId: decodedData.args.tokenId,
                    title: decodedData.args.title,
                    budget: decodedData.args.budget,
                    desc: decodedData.args.desc,
                    period: decodedData.args.period,
                }
            });
            let value = ``;
            for (const v of txs) {
                value += `
                ('${v.msgSenderAdddress}',${v.tokenId},'${v.title}',${v.budget},'${v.desc}'),
                `
            }
            let result = await dbUtil.insertPro(value.substring(0,(value.length-1))); 
            if (-1 != result) {
                await dbUtil.updateLastCheckBlock(latest);   
            }
        }
    }


    async function insertLabel(ctx) {
        let queryData = ctx.request.body;
        console.log("queryData=============",queryData);
        queryData = JSON.parse(queryData.proLabel)
        console.log(queryData);
        if (!queryData || queryData.length == 0) return _fail(ctx,'Failed to insert label',"Parameter error");
        let pro_content = queryData.pro_content;
        let recruiting_role = queryData.recruiting_role;
        let pro_type = queryData.pro_type;
        
        let sql = `insert into project(desc,role,pro_type) 
        VALUES ('${pro_content}','${recruiting_role}','${pro_type}');
        `;
        try {
            let num = await db.batchInsert(sql);
            ctx.response.body = Object.assign(num);
        } catch (err) {
            console.log('Failed to insert label', { sql }, err);
            return result.fail(ctx,'Failed to insert label',err);
        }
        return result.succeed(ctx);
    }


module.exports = {
    insertLog,
    insertLabel
};