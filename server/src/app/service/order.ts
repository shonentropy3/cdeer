import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from '../db/entity/Orders';	//引入entity
const { ethers } = require('ethers');
import { setOrder } from '../db/sql/order';
import { createOrderSql } from '../db/sql/sql'

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Orders)
        private readonly ordersRepository: Repository<Orders>,
    ) {}

    // 创建订单
    async createOrder(@Body() body: any){
        
        // return await this.ordersRepository.query(setOrder(body))
        // .then(res => {
        //     // console.log(res);
        //     return {
        //         code: 200
        //     }
        // })
        // .catch(err => {
            
        // })
        
        return await this.orderInterval(body.hash)
        .then(async (res)=>{
            if (res.code === "SUCCESS") {
                return {
                    code: 200
                }
            }else{
                return await this.ordersRepository.query(setOrder(body))
                .then((res)=>{
                    return {
                        code: 200
                    }
                })
            }
        })
    }


    // 定时任务
    async orderInterval(hash:any) {
        const rpcProvider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL)
        return await new Promise ((resolve,reject)=>{
            rpcProvider.waitForTransaction(hash,1,4000)
            .then((res:any)=>{resolve(res)})
            .catch((err:any)=>{reject(err)})
            
        })
        .then(async (res:any)=>{
            
            const createOrder = new ethers.utils.Interface([
                "event OrderCreated(uint indexed taskId, uint indexed orderId,  address issuer, address worker, address token, uint amount)"
            ]);
            let decodedData = createOrder.parseLog(res.logs[0]);
            const orderId = decodedData.args.orderId.toString();
            const taskId = decodedData.args.taskId.toString();
            const worker = decodedData.args.worker;
            const issuer = decodedData.args.issuer;
            const amount = decodedData.args.amount.toString();
            let params = {
                orderId: orderId,
                taskId: taskId,
                hash: hash,
                worker: worker,
                issuer: issuer,
                amount: amount
            }
            let sql = createOrderSql(params)
            await this.ordersRepository.query(sql.sql)
            return {
                code: "SUCCESS",
                oid: orderId
            }
        })
        .catch(err => {

            return {
                code: "Error"
            }
        })
    }

    
}
