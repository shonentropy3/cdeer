import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const { ethers } = require('ethers');
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const USDR_ADDR = require('../../../deployments/Demand.json');
import { BlockLog } from '../../entity/BlockLog';	//引入entity

@Injectable()
export class TaskService {
    constructor(
      @InjectRepository(BlockLog)
      private readonly blockLogRepository: Repository<BlockLog>,
      ) {}
      private readonly logger = new Logger(TaskService.name)
      // @Cron('45 * * * * *')  // 每隔45秒执行一次
  // handleCron() {
  //   this.logger.debug('Called when the second is 45');
  // }

_insertLog = async () => {
    let latest = await rpcProvider.getBlockNumber();
    let last_check_block = await this.blockLogRepository.query(`SELECT block FROM block_log WHERE id = 0;`);

    

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
        // let result = await insertPro(value.substring(0,(value.length-1))); 
        let params = value.substring(0,(value.length-1))
        let result = await this.blockLogRepository.query(`UPDATE project SET user_address = temp.user_address,token_id = temp.token_id,title = temp.title,budget = temp.budget,update_time = now()
        from (values ${params}) as temp (user_address,token_id,title,budget,desc) where project.desc=temp.requirements; 
        `)

        if (-1 != result) {
            // await updateLastCheckBlock(latest);   
            await this.blockLogRepository.query(`UPDATE block_log SET block = ${latest} WHERE id = 1;`)
        }
    }
  }

  @Interval(3000)  //每隔3秒执行一次
  handleInterval() {
    this._insertLog()
  }

  init() {
    // global.lock_get_logs = 0;
    console.log('初始化啦');
  }

  @Timeout(20)  //5秒只执行一次
  handleTimeout() {
    this.init()
    
    // this.logger.debug('Called once after 5 seconds');
  }

}
