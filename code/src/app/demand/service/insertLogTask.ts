import '../../common/provider'
import '../../common/dbUtil'
import "hardhat"
const USDR_ADDR = require('../../../../deployments/Demand.json');
// const { rpcProvider } = require('../../common/provider');
// import rpcProvider from '../../common/provider';



export default async function insertLog() {

    // const USDR_ADDR = require('../../../deployments/Demand.json');

    // const _insertLog = async () => {
    //   let latest = await rpcProvider.getBlockNumber();
    //   let last_check_block = await getLastCheckBlock();
    //   if (last_check_block >= latest) return; //区块已监听过了
    //   last_check_block = Math.max(last_check_block, (latest - 100)); //最多往前100区块
    //   let fromBlock = last_check_block + 1;
    //   let toBlock = latest;
    //   let filter = {
    //       address: USDR_ADDR.address,
    //       topics: [
    //           ethers.utils.id("CreateProject(address,uint256,string,uint256,string,uint256)")
    //       ],
    //       fromBlock,
    //       toBlock
    //   }
    //   let logs = await rpcProvider.getLogs(filter);
    //   const CreatProjectEvent = new ethers.utils.Interface(["event CreateProject(address indexed user, uint256 indexed tokenId, string title, uint256 budget, string desc, uint256 period)"]);
    //   if (logs.length > 0) {
    //       let txs = logs.map(ele => {
    //           let decodedData = CreatProjectEvent.parseLog(ele);
    //           return {
    //               msgSenderAdddress: decodedData.args.msgSenderAdddress,
    //               tokenId: decodedData.args.tokenId,
    //               title: decodedData.args.title,
    //               budget: decodedData.args.budget,
    //               desc: decodedData.args.desc,
    //               period: decodedData.args.period,
    //           }
    //       });
    //       let value = ``;
    //       for (const v of txs) {
    //           value += `
    //           ('${v.msgSenderAdddress}',${v.tokenId},'${v.title}',${v.budget},'${v.desc}'),
    //           `
    //       }
    //       let result = await insertPro(value.substring(0,(value.length-1))); 
    //       if (-1 != result) {
    //           await updateLastCheckBlock(latest);   
    //       }
    //   }
    // }



    if (global.lock_get_logs) return;
    global.lock_get_logs = 1;
    // await _insertLog();
    global.lock_get_logs = 0;
}