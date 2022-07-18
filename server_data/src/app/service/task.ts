import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { Demand } from 'src/app/db/entity/Demand';
import { BlockLog } from 'src/app/db/entity/BlockLog';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getLastBlock,getModifyDemandLastBlock, getHash} from 'src/app/db/sql/sql';
import { updateProject } from 'src/app/db/sql/sql';
import { updateBlock } from 'src/app/db/sql/sql';
const { ethers } = require('ethers');
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const USDR_ADDR = require('../../../deployments/Demand.json');

// 信息同步hash表：待同步类型：1.创建需求 2.修改需求 3.报名 4.修改报名 5.删除报名

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Demand)
        private readonly demandRepository: Repository<Demand>,
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
            console.log('===',filter);
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
                  let result = await this.demandRepository.query(sql)
                  this.logger.debug('insertCreateDemand');
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
            }
    }

    insertApplyFor = async () => {
        //获取未同步的信息
        let latest = await rpcProvider.getBlockNumber();
        let last = await this.blockLogRepository.query(getLastBlock());
        let logBlock = last[0].block;
        if (logBlock >= latest) return; // 区块已监听过了
        logBlock = Math.max(logBlock, (latest - 100)); // 最多往前100区块
        let fromBlock = logBlock + 1;
        let toBlock = latest;
        
        //寻找所有未同步的数据
        let applyFor = await this.blockLogRepository.query(getHash(3));
        let filter = {
            address: applyFor.transHash,
            topics: [
                ethers.utils.id("ApplyFor(uint256,address,uint256)")
            ],
            fromBlock,
            toBlock
        }
        const logs = await rpcProvider.getLogs(filter);
        const ApplyFor = new ethers.utils.Interface(["event ApplyFor(uint256 indexed demandId, address indexed applyAddr, uint256 previewPrice)"]);
        
        if (logs.length > 0) {
            let txs = logs.map((ele: any) => {
                let decodedData = ApplyFor.parseLog(ele);
                return {
                    demandId: decodedData.args[0].toString(),
                    applyAddr: decodedData.args[1],
                    previewPrice: decodedData.args[2].toString()
                }
            });
            let value = ``;
            for (const v of txs) {
                value += `
                (${v.demandId}, '${v.applyAddr}',${v.previewPrice}),
                `
            }
            let sqlValue = value.substring(0,(value.lastIndexOf(',')))
            let paramsSql = {
                value: sqlValue,
                transHash: applyFor.transHash
            }
            let sql = updateProject(paramsSql)
            
            try {
              let result = await this.demandRepository.query(sql)
              this.logger.debug('insertCreateDemand');
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
              let result = await this.demandRepository.query(sql)
              this.logger.debug('modifyDemandLog');
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
        }
}

    @Interval(5000)  //每隔5秒执行一次
    handleInterval() {
        // this.insertCreateDemand()
        // this.modifyDemandLog()  
        // this.logger.debug('Called 5 seconds');
        
    }

    @Timeout(1000)
    async handleTimeout() {
        this.insertCreateDemand()
        this.modifyDemandLog()  
    }
}
