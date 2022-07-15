import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { Project } from 'src/app/db/entity/Project';
import { BlockLog } from 'src/app/db/entity/BlockLog';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getLastBlock,getModifyDemandLastBlock } from 'src/app/db/sql/sql';
import { updateProject } from 'src/app/db/sql/sql';
import { updateBlock } from 'src/app/db/sql/sql';
const { ethers } = require('ethers');
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const USDR_ADDR = require('../../../deployments/Demand.json');


@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(BlockLog)
        private readonly blockLogRepository: Repository<BlockLog>
    ) {}

    private readonly logger = new Logger(TaskService.name)

    insertCreateDemand = async () => {
            let latest = await rpcProvider.getBlockNumber();
            let last = await this.blockLogRepository.query(getLastBlock());
            let logBlock = last[0].block;
            if (logBlock >= latest) return; // 区块已监听过了
            logBlock = Math.max(logBlock, (latest - 100)); // 最多往前100区块
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
            const CreateDemand = new ethers.utils.Interface(["event CreateDemand(uint256 indexed demandId, address indexed demandAddr, string title, uint256 budget, string desc, string attachment, uint256 period)"]);
            if (logs.length > 0) {
                let txs = logs.map((ele: any) => {
                    let decodedData = CreateDemand.parseLog(ele);
                    return {
                        demandId: decodedData.args[0].toString(),
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
                    (${v.demandId}, '${v.title}',${v.budget},'${v.desc}'),
                    `
                }
                let sqlValue = value.substring(0,(value.lastIndexOf(',')))
                let paramsSql = {
                    statusId: 1,
                    value: sqlValue
                }
                let sql = updateProject(paramsSql)
                try {
                  let result = await this.projectRepository.query(sql)
                  if (-1 != result[1]) {
                      let params = {
                        id: 0,
                        latest: latest,
                    }
                      await this.blockLogRepository.query(updateBlock(params))
                  }
                } catch (error) {
                  console.log(error);
                }
            }else{
              console.log(logs.length);
            }
    }

    modifyDemandLog = async () => {
        let latest = await rpcProvider.getBlockNumber();
        let last = await this.blockLogRepository.query(getModifyDemandLastBlock());
        let logBlock = last[0].block;
        if (logBlock >= latest) return; //区块已监听过了
        logBlock = Math.max(logBlock, (latest - 100)); //最多往前100区块
        let fromBlock = logBlock + 1;
        let toBlock = latest;
        let filter = {
            address: USDR_ADDR.address,
            topics: [
                ethers.utils.id("ModifyDemand(uint256,address,string,uint256,string,string,uint256)")
            ],
            fromBlock,
            toBlock
        }
        const logs = await rpcProvider.getLogs(filter);
        const CreateDemand = new ethers.utils.Interface(["event ModifyDemand(uint256 indexed demandId, address demandAddr, string title, uint256 budget, string desc, string attachment, uint256 period)"]);
        if (logs.length > 0) {
            let txs = logs.map((ele: any) => {
                let decodedData = CreateDemand.parseLog(ele);
                return {
                    demandId: decodedData.args[0].toString(),
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
                    (${v.demandId}, '${v.title}', ${v.budget}, '${v.desc}'),
                `
            }
            let sqlValue = value.substring(0,(value.lastIndexOf(',')))
            let paramsSql = {
                statusId: 1,
                value: sqlValue
            }
            let sql = updateProject(paramsSql)
            try {
              let result = await this.projectRepository.query(sql)
              if (-1 != result[1]) {
                  let params = {
                      id: 1,
                      latest: latest,
                  }
                  await this.blockLogRepository.query(updateBlock(params))
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
        this.insertCreateDemand()
        this.modifyDemandLog()  
    }

    @Timeout(1000)
    async handleTimeout() {

    }
}
