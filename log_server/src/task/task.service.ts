import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
// entity
import { Project } from 'src/entity/Project';
import { BlockLog } from 'src/entity/BlockLog';
// ethers
const { ethers } = require('ethers');
import 'ethers'
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const USDR_ADDR = require('../../deployments/Demand.json');
// db
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getLastBlock } from 'src/db/dbUtils';
import { updateProject } from 'src/db/dbUtils';
import { updateBlock } from 'src/db/dbUtils';


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
            let last = await this.blockLogRepository.query(getLastBlock());
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
                let params = value.substring(0,(value.lastIndexOf(',')))
                let sql = updateProject(params)
                
                try {
                  let result = await this.projectRepository.query(sql)
                  console.log(result[1]);
                  if (-1 != result[1]) {
                      // await updateLastCheckBlock(latest);   
                      await this.blockLogRepository.query(updateBlock(latest))
                  }
                } catch (error) {
                  console.log(error);
                }
            }else{
              console.log(logs.length);
            }
    }


    @Interval(5000)  //每隔3秒执行一次
    handleInterval() {
        this._insertLog()
        console.log('zxl');
        
    }

    @Timeout(1000)
    async handleTimeout() {

    }
}
