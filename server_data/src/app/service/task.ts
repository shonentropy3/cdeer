import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { Tasks } from 'src/app/db/entity/Tasks';
import { BlockLogs } from 'src/app/db/entity/BlockLogs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getLastBlock,getModifyDemandLastBlock, getTaskHash, createTaskSql,createOrderSql, getApplyForHash, getCancelApplyHash, getCreateOrderHash, getCacheNfts} from 'src/app/db/sql/sql';
import { updateProject, updateApplyInfo, cancelApply } from 'src/app/db/sql/sql';
import { updateBlock } from 'src/app/db/sql/sql';
import { ApplyInfo } from '../db/entity/ApplyInfo';
import { Nfts } from '../db/entity/Nfts';
const { ethers } = require('ethers');
// TODO:更改配置文件
// const rpcProvider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/d3fe47cdbf454c9584113d05a918694f");
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
// const USDR_ADDR = require('../../../deployments/dev/DeTask.json');

// 信息同步hash表：待同步类型：1.创建需求 2.修改需求 3.报名 4.修改报名 5.取消报名, 6.创建订单或者修改订单

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Tasks)
        private readonly tasksRepository: Repository<Tasks>,
        @InjectRepository(BlockLogs)
        private readonly blockLogRepository: Repository<BlockLogs>,
        @InjectRepository(ApplyInfo)
        private readonly applyInfoRepository: Repository<ApplyInfo>,
        @InjectRepository(Nfts)
        private readonly nftsRepository: Repository<Nfts>
    ) {}

    private readonly logger = new Logger(TaskService.name)

    insertApplyFor = async () => {
        //获取未同步的信息
        let latest = await rpcProvider.getBlockNumber();
        
        let last = await this.applyInfoRepository.query(getLastBlock());
        
        let logBlock = last[0].block;
        if (logBlock >= latest) return; // 区块已监听过了
        logBlock = Math.max(logBlock, (latest - 100)); // 最多往前100区块
        
        
        // 创建task任务
        let taskHash = await this.applyInfoRepository.query(getTaskHash());
        
        for (let v of taskHash) {
            const log = await rpcProvider.getTransactionReceipt(v.hash);
            const createTask = new ethers.utils.Interface(
                ["event TaskCreated(uint256 indexed,address,tuple(string,string,string,uint8,uint112,uint32,uint48,bool))"]
            );
            if (!log) {
                return
            }
            let decodedData = createTask.parseLog(log.logs[2]);
            const taskId = decodedData.args[0].toString();
            const _data = decodedData.args[2];

            let params = {
                taskId: taskId,
                hash: v.hash,
                title: _data[0],
                desc: _data[1],
                attachment: _data[2],
                budget: _data[4].toString(),
                period: _data[5]
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

        // 创建订单以及修改订单
        let createOrderHash = await this.applyInfoRepository.query(getCreateOrderHash());
        for (const v of createOrderHash) {
            const log = await rpcProvider.getTransactionReceipt(v.hash);
            const createOrder = new ethers.utils.Interface([
                "event OrderCreated(uint indexed taskId, uint indexed orderId,  address issuer, address worker, address token, uint amount)"
            ]);
            let decodedData = createOrder.parseLog(log.logs[0]);
            const orderId = decodedData.args.orderId.toString();
            const taskId = decodedData.args.taskId.toString();
            const worker = decodedData.args.worker;
            const issuer = decodedData.args.issuer;
            const amount = decodedData.args.amount.toString();
            let params = {
                orderId: orderId,
                taskId: taskId,
                hash: v.hash,
                worker: worker,
                issuer: issuer,
                amount: amount
            }
            
            let sql = createOrderSql(params)
            try {
                let sqlResult = await this.applyInfoRepository.query(sql.sql);
                if (-1 != sqlResult[1]) {
                    await this.applyInfoRepository.query(sql.sqlUpdateTH);
                }
                this.logger.debug('createOrders');
            } catch (error) {
                console.log(error);
            }
        }

        // 报名
        let applyForHash = await this.applyInfoRepository.query(getApplyForHash());
        for (const v of applyForHash) {
            const log = await rpcProvider.getTransactionReceipt(v.hash);
            const ApplyFor = new ethers.utils.Interface(["event ApplyFor(uint256 indexed taskId, address indexed taker, uint256 valuation)"]);
            let decodedData = ApplyFor.parseLog(log.logs[0]);
            const taskId = decodedData.args.taskId.toString();
            const taker = decodedData.args.taker;
            const valuation = decodedData.args.valuation.toString();
            let params = {
                taskId: taskId,
                applyAddr: taker,
                valuation: valuation,
                hash: v.hash
            }
            let sql = updateApplyInfo(params)
        try {
            let sqlBefore = await this.applyInfoRepository.query(sql.sqlBefore);
            let sqlUpdateAI,insertAI;
            if (sqlBefore.length > 0) {
                sqlUpdateAI = await this.applyInfoRepository.query(sql.sqlUpdateAI);
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
        


}

    // clearNftCache = async () => {
    //     const min10 = Date.now()-600000;
    //     this.nftsRepository.query(getCacheNfts(min10))
    // }

    @Interval(5000)  //每隔5秒执行一次
    handleInterval() {
        // this.modifyDemandLog()  
        this.insertApplyFor()
        // this.clearNftCache()
        // this.logger.debug('Called 5 seconds');
    }

    @Timeout(1000)
    async handleTimeout() {
        // this.insertCreateDemand()
        // this.modifyDemandLog()  
        // this.insertApplyFor()
    }
}
