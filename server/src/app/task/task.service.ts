import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const { ethers } = require('ethers');
import 'ethers'
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const USDR_ADDR = require('../../../deployments/Demand.json');
import { BlockLog } from '../../entity/BlockLog';	//引入entity
import { Project } from '../../entity/Project';	//引入entity
import { last_check_block } from '../db/dbutils';


@Injectable()
export class TaskService {
    constructor(
      @InjectRepository(Project)
      private readonly projectRepository: Repository<Project>,
      @InjectRepository(BlockLog)
      private readonly blockLogRepository: Repository<BlockLog>
      ) {}
      private readonly logger = new Logger(TaskService.name)

_insertLog = async () => {
    let latest = await rpcProvider.getBlockNumber();
    let last = await this.blockLogRepository.query(last_check_block());
    console.log(last);
    

    let logBlock = last[0].block;
    
    if (logBlock >= latest) return; //区块已监听过了
    logBlock = Math.max(logBlock, (latest - 100)); //最多往前100区块
    let fromBlock = logBlock + 1;
    let toBlock = latest;
    let filter = {
        address: USDR_ADDR.address,
        topics: [
            ethers.utils.id("CreateDemand(uint256,address,string,uint256,string,string,uint256)")
        ],
        fromBlock,
        toBlock
    }
    const logs = await rpcProvider.getLogs(filter);

    const CreateDemand = new ethers.utils.Interface(["event CreateDemand(uint256 indexed demandId, address indexed demander, string title, uint256 budget, string desc, string attachment, uint256 )"]);

    
    if (logs.length > 0) {
      
        let txs = logs.map((ele: any) => {
            let decodedData = CreateDemand.parseLog(ele);

            return {
                demandId: decodedData.args[0].toString(),
                demander: decodedData.args[1],
                title: decodedData.args[2],
                budget: decodedData.args[3].toString(),
                desc: decodedData.args[4],
                attachment: decodedData.args[5],
                period: decodedData.args[6].toString(),
            }
        });
        let value = ``;

        for (const v of txs) {
            value += `
            ('${v.demander}',${v.demandId},'${v.title}',${v.budget},'${v.desc}'),
            `
        }
        console.log(value);
        
        // let result = await insertPro(value.substring(0,(value.length-1))); 
        let params = value.substring(0,(value.lastIndexOf(',')))
        // let sql = `UPDATE project 
        // SET user_address = temp.user_address, pro_id = temp.demandId, title = temp.title, budget = temp.budget, update_time = now()
        // from (values ('demander', 2343, 'title', 324, 'desc')) as temp (user_address, demandId,title, budget,content) where project.content=temp.content;
        // `

        let sql = `UPDATE project 
        SET user_address = temp.user_address, pro_id = temp.demandId, title = temp.title, budget = temp.budget, update_time = now()
        from (values ${params}) as temp (user_address, demandId,title, budget,content) where project.content=temp.content;
        `

        console.log(sql);
        
        try {
          let result = await this.projectRepository.query(sql)
          console.log(result[1]);
          if (-1 != result[1]) {
              // await updateLastCheckBlock(latest);   
              await this.blockLogRepository.query(`UPDATE block_log SET block = ${latest} WHERE id = 0;`)
          }
        } catch (error) {
          console.log(error);
        }
    }else{
      console.log(logs.length);
    }
  }

  @Interval(3000)  //每隔3秒执行一次
  handleInterval() {
    // this._insertLog()
  }

  init() {
    // global.lock_get_logs = 0;
    console.log('初始化啦');
  }

  @Timeout(20)  //5秒只执行一次
  handleTimeout() {
    this.init()
    this._insertLog()

    
    // let op = this.projectRepository.query(sql)
    // console.log(op);
    
    // this.logger.debug('Called once after 5 seconds');
  }

}
