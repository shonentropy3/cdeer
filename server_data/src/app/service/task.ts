import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { Tasks } from 'src/app/db/entity/Tasks';
import { BlockLogs } from 'src/app/db/entity/BlockLogs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getLastBlock,getModifyDemandLastBlock, getTaskHash, createTaskSql,createOrderSql, getApplyForHash, getCancelApplyHash, getCreateOrderHash} from 'src/app/db/sql/sql';
import { updateProject, updateApplyInfo, cancelApply } from 'src/app/db/sql/sql';
import { updateBlock } from 'src/app/db/sql/sql';
import { ApplyInfo } from '../db/entity/ApplyInfo';
const { ethers } = require('ethers');
// TODO:更改配置文件
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const USDR_ADDR = require('../../../deployments/Task.json');

// 信息同步hash表：待同步类型：1.创建需求 2.修改需求 3.报名 4.修改报名 5.取消报名, 6.创建订单或者修改订单

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Tasks)
        private readonly tasksRepository: Repository<Tasks>,
        @InjectRepository(BlockLogs)
        private readonly blockLogRepository: Repository<BlockLogs>,
        @InjectRepository(ApplyInfo)
        private readonly applyInfoRepository: Repository<ApplyInfo>
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
                    ethers.utils.id("CreateTask(uint256,address,string,uint256,string,string,uint256)")
                ],
                fromBlock,
                toBlock
            }
            const logs = await rpcProvider.getLogs(filter);
            const CreateTask = new ethers.utils.Interface(["event CreateTask(uint256 indexed taskId, address indexed maker, string title, uint256 budget, string desc, string attachment, uint256 period)"]);
            if (logs.length > 0) {
                
                let txs = logs.map((ele: any) => {
                    let decodedData = CreateTask.parseLog(ele);
                    console.log();
                    return {
                        taskId: decodedData.args[0].toString(),
                        title: decodedData.args[2],
                        budget: Number(decodedData.args[3].toString())/100,
                        desc: decodedData.args[4],
                        attachment: decodedData.args[5],
                        period: decodedData.args[6].toString(),
                    }
                });
                let value = ``;
                for (const v of txs) {
                    value += `
                    (${v.taskId}, '${v.title}','${v.desc}', ${v.budget}, ${v.period}, '${v.attachment}'),
                    `
                }
                let sqlValue = value.substring(0,(value.lastIndexOf(',')))
                let paramsSql = {
                    statusId: 1,
                    value: sqlValue
                }
                let sql = updateProject(paramsSql)
                
                try {
                  let result = await this.tasksRepository.query(sql)
                  
                  this.logger.debug('insertCreateTask');
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
                ethers.utils.id("ModifyTask(uint256,address,string,uint256,string,string,uint256)")
            ],
            fromBlock,
            toBlock
        }
        const logs = await rpcProvider.getLogs(filter);
        const CreateTask = new ethers.utils.Interface(["event ModifyTask(uint256 indexed taskId, address maker, string title, uint256 budget, string desc, string attachment, uint256 period)"]);
        if (logs.length > 0) {
            let txs = logs.map((ele: any) => {
                let decodedData = CreateTask.parseLog(ele);
                return {
                    taskId: decodedData.args[0].toString(),
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
                    (${v.taskId}, '${v.title}','${v.desc}', ${v.budget}, ${v.period}, '${v.attachment}'),
                `
            }
            let sqlValue = value.substring(0,(value.lastIndexOf(',')))
            let paramsSql = {
                statusId: 1,
                value: sqlValue
            }
            let sql = updateProject(paramsSql)
            try {
              let result = await this.tasksRepository.query(sql)
              this.logger.debug('modifyTaskLog');
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

    insertApplyFor = async () => {
        //获取未同步的信息
        let latest = await rpcProvider.getBlockNumber();
        let last = await this.applyInfoRepository.query(getLastBlock());
        let logBlock = last[0].block;
        if (logBlock >= latest) return; // 区块已监听过了
        logBlock = Math.max(logBlock, (latest - 100)); // 最多往前100区块
        let fromBlock = logBlock + 1;
        let toBlock = latest;

<<<<<<< Updated upstream
        // // 创建task任务
        // let taskHash = await this.applyInfoRepository.query(getTaskHash());
        // for (const v of taskHash) {
        //     const log = await rpcProvider.getTransactionReceipt(v.hash);
        //     const createTask = new ethers.utils.Interface(["event CreateTask(uint256 indexed taskId, address indexed maker, string title, uint256 budget, string desc, string attachment, uint256 period)"]);
            
        //     let decodedData = createTask.parseLog(log.logs[0]);
        //     const taskId = decodedData.args.taskId.toString();
        //     const title = decodedData.args.title;
        //     const budget = Number(decodedData.args.budget.toString())/100;
        //     const desc = decodedData.args.desc;
        //     const attachment = decodedData.args.attachment;
        //     const period = decodedData.args.period.toString;
        //     let params = {
        //         taskId: taskId,
        //         hash: v.hash,
        //         title: title,
        //         budget: budget,
        //         desc: desc,
        //         attachment: attachment,
        //         period: period
        //     }
        //     let sql = createTaskSql(params)
        //     try {
        //         let sqlResult = await this.applyInfoRepository.query(sql.sql);
        //         if (-1 != sqlResult[1]) {
        //             await this.applyInfoRepository.query(sql.sqlUpdateTH);
        //         }
        //         this.logger.debug('createTasks');
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }
=======
        // 创建task任务
        let taskHash = await this.applyInfoRepository.query(getTaskHash());
        for (const v of taskHash) {
            const log = await rpcProvider.getTransactionReceipt(v.hash);
            const createTask = new ethers.utils.Interface(["event CreateTask(uint256 indexed taskId, address indexed maker, string title, uint256 budget, string desc, string attachment, uint256 period)"]);
            let decodedData = createTask.parseLog(log.logs[0]);
            const taskId = decodedData.args.taskId.toString();
            const title = decodedData.args.title;
            const budget = Number(decodedData.args.budget.toString())/100;
            const desc = decodedData.args.desc;
            const attachment = decodedData.args.attachment;
            const period = decodedData.args.period.toString;
            let params = {
                taskId: taskId,
                hash: v.hash,
                title: title,
                budget: budget,
                desc: desc,
                attachment: attachment,
                period: period
            }
            let sql = createTaskSql(params)
            try {
                let sqlResult = await this.applyInfoRepository.query(sql.sql);
                if (-1 != sqlResult[1]) {
                    await this.applyInfoRepository.query(sql.sqlUpdateTH);
                }
                this.logger.debug('createTasks');
            } catch (error) {
                console.log(error);
            }
        }
>>>>>>> Stashed changes

        // 报名
        let applyForHash = await this.applyInfoRepository.query(getApplyForHash());
        for (const v of applyForHash) {
            const log = await rpcProvider.getTransactionReceipt(v.hash);
            const ApplyFor = new ethers.utils.Interface(["event ApplyFor(uint256 indexed taskId, address indexed taker, uint256 valuation)"]);
            let decodedData = ApplyFor.parseLog(log.logs[0]);
            const taskId = decodedData.args.taskId.toString();
            const taker = decodedData.args.taker.toLowerCase();
            const valuation = decodedData.args.valuation.toString();
            let params = {
                taskId: taskId,
                applyAddr: taker,
                valuation: Number(valuation)/100,
                hash: v.hash
            }
            let sql = updateApplyInfo(params)
        try {
            let sqlBefore = await this.applyInfoRepository.query(sql.sqlBefore);
            let sqlUpdateAI,insertAI;
            if (sqlBefore.length > 0) {
                sqlUpdateAI = await this.applyInfoRepository.query(sql.sqlUpdateAI);
                console.log(sqlUpdateAI,'========');
                
            } else {
                insertAI = await this.applyInfoRepository.query(sql.insert);
            }
            if (-1 != sqlUpdateAI[1] || -1 != insertAI[1]) {
                await this.applyInfoRepository.query(sql.sqlUpdateTH);
            }
            this.logger.debug('insertApplyFor');
        } catch (error) {
            console.log(error);
        }
        }

        // 取消报名
        let cancelApplyHash = await this.applyInfoRepository.query(getCancelApplyHash()); 
        for (const v of cancelApplyHash) {
            const log = await rpcProvider.getTransactionReceipt(v.hash);
            const CancelApply = new ethers.utils.Interface(["event CancelApply(uint256 indexed taskId, address taker)"]);
            let decodedData = CancelApply.parseLog(log.logs[0]);
            const taskId = decodedData.args.taskId.toString();
            const taker = decodedData.args.taker.toLowerCase();
            let params = {
                taskId: taskId,
                taker: taker,
                hash: v.hash
            }
            let sql = cancelApply(params)
        try {
            let sqlBefore = await this.applyInfoRepository.query(sql.sqlBefore);
            let sqlDeletAI;
            if (sqlBefore.length > 0) {
                sqlDeletAI = await this.applyInfoRepository.query(sql.sqlDeletAI);
                if (-1 != sqlDeletAI[1]) {
                await this.applyInfoRepository.query(sql.sqlUpdateTH);
            }
            } 

            this.logger.debug('insertApplyFor');
        } catch (error) {
            console.log(error);
        }
        }

        // 未同步连上数据
        // // 创建订单以及修改订单
        // let createOrderHash = await this.applyInfoRepository.query(getCreateOrderHash());
        // for (const v of createOrderHash) {
        //     const log = await rpcProvider.getTransactionReceipt(v.hash);
        //     const createOrder = new ethers.utils.Interface([
        //         "event CreateOrder(uint256 indexed taskId, address indexed issuer, address indexed worker, uint256 amount)"
        //     ]);
        //     let decodedData = createOrder.parseLog(log.logs[0]);
        //     const orderId = decodedData.args.orderId.toString();
        //     const taskId = decodedData.args.taskId.toString();
        //     const worker = decodedData.args.worker;
        //     const amount = decodedData.args.amount.toString();
        //     let params = {
        //         orderId: orderId,
        //         taskId: taskId,
        //         hash: v.hash,
        //         worker: worker,
        //         amount: amount
        //     }
        //     let sql = createOrderSql(params)
        //     try {
        //         let sqlResult = await this.applyInfoRepository.query(sql.sql);
        //         if (-1 != sqlResult[1]) {
        //             await this.applyInfoRepository.query(sql.sqlUpdateTH);
        //         }
        //         this.logger.debug('createOrders');
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }


}

    @Interval(5000)  //每隔5秒执行一次
    handleInterval() {
        this.insertCreateDemand()
        this.modifyDemandLog()  
        this.insertApplyFor()
        // this.logger.debug('Called 5 seconds');
    }

    @Timeout(1000)
    async handleTimeout() {
        // this.insertCreateDemand()
        // this.modifyDemandLog()  
        // this.insertApplyFor()
    }
}
