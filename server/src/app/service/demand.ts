import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { async, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tasks } from '../db/entity/Tasks';	//引入entity
const { ethers } = require('ethers');

// dbUtils
import { getDemandDate, getDemandInfoDate, setDemand, moDemand, delDemand, getFilter, getOrdersDate, getOrderInfo, getSearchData, getIssuerOrdersDate, updateTask } from '../db/sql/demand';
import { createTaskSql } from '../db/sql/sql';


@Injectable()
export class MarketService {
    constructor(
        @InjectRepository(Tasks)
        private readonly tasksRepository: Repository<Tasks>,
    ) {}

    // 获取需求列表
    async getDemand(): Promise<Tasks[]> {
        // console.log(this. .get('PORT'), '当前的端口');
        return await this.tasksRepository.query(getDemandDate())
        .then(res =>{
            let obj = {
                code: 200,
                data: res
            }
            return obj
        })
        .catch(err => {
            console.log('getDemand err =>', err)
            return err
        });
    }

    // 获取搜索列表
    async getSearch(name: any): Promise<Tasks[]> {
        return await this.tasksRepository.query(getSearchData(name))
        .then(res =>{
            let obj = {
                code: 200,
                data: res
            }
            return obj
        })
        .catch(err => {
            console.log('getDemand err =>', err)
            return err
        });
    }

    // 获取未划分阶段订单
    async getOrder(account) {
        if (account.length === 42) {
            return await this.tasksRepository.query(getOrdersDate(account))
            .then(res => {
                let arr = [];
                res.map(e => {
                    arr.push({
                        oid: Number(e.order_id),
                        tid: Number(e.task_id),
                        stagejson: e.attachment
                    });
                })
                return arr
            })
        }else if(account.length === 43){
            account = account.replace('_','');
            return await this.tasksRepository.query(getIssuerOrdersDate(account))
            .then(res => {
                let arr = [];
                res.map(e => {
                    arr.push({
                        oid: Number(e.order_id),
                        tid: Number(e.task_id),
                        stagejson: e.attachment
                    });
                })
                return arr
            })
        }else{
            return await this.tasksRepository.query(getOrderInfo(account))
            .then(res => {
                let arr = [];
                res.map(e => {
                    arr.push({
                        oid: Number(e.order_id),
                        tid: Number(e.task_id),
                        stagejson: e.attachment
                    });
                })
                return arr
            })
        }
        
        
        
    }

    async getTask(arr) {
        return new Promise((resolve, reject) => {
            arr.map(async(e,i) => {
                
                   await this.tasksRepository.query(getDemandInfoDate(e.tid))
                    .then(task => {
                        e.data = task[0];
                        if (i + 1 === arr.length) {
                            resolve(arr)
                        }
                    }) 
            })
        }).then(() => {
            return arr            
        })
    }

    // 获取筛选列表
    async getFilter(@Body() body: any): Promise<Tasks[]> {
        let data = JSON.parse(body.obj);
        return await this.tasksRepository.query(getFilter(data))
        .then(res =>{
            let obj = {
                code: 200,
                data: res
            }
            return obj
        })
        .catch(err => {
            console.log('getDemandInfo =>', err)
            return err
        });
    }
    

    // 获取项目详情
    async getDemandInfo(@Body() body: any): Promise<Tasks[]> {
        let id = Number(body.id)
        return await this.tasksRepository.query(getDemandInfoDate(id))
        .then(res =>{
            let obj = {
                code: 200,
                data: res
            }
            return obj
        })
        .catch(err => {
            console.log('getDemandInfo =>', err)
            return err
        });
    }

    // 发布需求
    async createDemand(@Body() body: any){
        let bodyData = JSON.parse(body.proLabel);
        let sql = setDemand(bodyData)
        // 解析交易哈希
        return await this.taskInterval(bodyData.payhash)
        .then(async(res: any) => {
            if (res.code === 'SUCCESS') {
                // 解析成功 ==> update tables.tasks
                bodyData.task_id = res.data.tid;
                await this.tasksRepository.query(updateTask(bodyData))

                return {
                    code: 'SUCCESS'
                }
            }else{
                // 解析失败 ==> insert tables.trans_hashes ==> insert tables.task
                await this.tasksRepository.query(sql.sql)
                await this.tasksRepository.query(sql.sqlHash)

                return {
                    code: 'SUCCESS'
                }
            }
        })
    }


    // 修改需求
    async modifyDemand(@Body() body: any): Promise<Tasks[]>  {
        console.log(body);
        
        let bodyData = JSON.parse(body.proLabel);
        return await this.tasksRepository.query(moDemand(bodyData))
        .then(res=>{
            let obj = {
                code: 200
            }
            return obj
        })
        .catch(err => {
            console.log('modifyDemand =>错误', err);
            return err
        })
    }

    // 删除需求
    async deleteDemand(@Body() body: any): Promise<Tasks[]>  {
        let data = body
        console.log(body);
        // return
        return await this.tasksRepository.query(delDemand(data))
        .then(res=>{
            let obj = {
                code: 200
            }
            return obj
        })
        .catch(err => {
            console.log('deleteDemand err=>', err);
            return err
        })
    }

    // 定时任务
    async taskInterval(hash: any) {
        const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
        // const rpcProvider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com");
        return await new Promise((resolve, reject) => {
            rpcProvider.waitForTransaction(hash, 1, 4000)   //  4秒等待时长 ==>
            .then((res: any) => { resolve(res) })
            .catch((err: any) => { reject(err) })
        })
        .then(async(res: any) => {
            const createTask = new ethers.utils.Interface(
                ["event TaskCreated(uint256 indexed,address,tuple(string,string,string,uint8,uint112,uint32,uint48,bool))"]
            );
            
            let decodedData = createTask.parseLog(res.logs[2]);
            const taskId = decodedData.args[0].toString();
            const _data = decodedData.args[2];
    
            let params = {
                taskId: taskId,
                hash: hash,
                title: _data[0],
                desc: _data[1],
                attachment: _data[2],
                budget: _data[4].toString(),
                period: _data[5]
            }
            let sql = createTaskSql(params)
            // 写入数据库
            await this.tasksRepository.query(sql)
            return {
                code: 'SUCCESS',
                data: {
                    tid: taskId
                }
            }
        })
        .catch(err => {
            return {
                code: 'ERROR'
            }
        })
    }

    // AxiosErrorTip
    handleError(error: AxiosError) {
        if (error.response) {
          if (error.response.status === HttpStatus.NOT_FOUND) {
            return throwError(new NotFoundException(error.response.data));
          } else if (error.response.status === HttpStatus.BAD_REQUEST) {
            return throwError(new BadRequestException(error.response.data));
          } else {
            return throwError(new HttpException(error.response.data, error.response.status));
          }
        } else {
          return throwError(error.message);
        }
    }

}
