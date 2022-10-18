import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplyInfo } from '../db/entity/ApplyInfo';	
import { Users } from '../db/entity/Users';
import { setApply, getApply, delApply, modifyApplySwitch, setApplylist, getMyApply, updateApply, modifyApplySort } from '../db/sql/demand';
import { updateApplyInfo } from '../db/sql/sql';
import { getMyInfo, modifyContacts, setContacts } from '../db/sql/user';
const { ethers } = require('ethers');

@Injectable()
export class ApplyforService {
    constructor(
        @InjectRepository(ApplyInfo)
        private readonly applyInfoRepository: Repository<ApplyInfo>,
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ) {}


    async apply(@Body() body: any) {
        let bodyData = JSON.parse(body.proLabel)

        await this.applyInterval(bodyData.hash)
        .then(async(res: any) => {
            console.log('res ==>',res);
            
            if (res.code === 'SUCCESS') {
                // 解析成功 ==> update tables.applyInfo
                await this.applyInfoRepository.query(updateApply(bodyData))

                return {
                    code: 'SUCCESS'
                }
            }else{
                // 解析失败 ==> insert tables.trans_hashes
                await this.applyInfoRepository.query(setApply(bodyData))

                return {
                    code: 'SUCCESS'
                }
            }
        })
        // await this.applyInfoRepository.query(getMyApply(bodyData))
        // .then(res => {
        //     if (res.length === 0) {
        //         this.applyInfoRepository.query(setApplylist(bodyData))
        //     }else{
        //         this.applyInfoRepository.query(updateApply(bodyData))
        //     }
        // })
        this.usersRepository.query(getMyInfo(bodyData.address))
        .then(res => {
            let obj = bodyData.contact;
            for (const i in obj) {
                if (obj[i].length === 0) {
                    return
                }
            }
            if (res.length === 0) {
                this.usersRepository.query(setContacts(bodyData))
            }else{
                this.usersRepository.query(modifyContacts(bodyData))
            }
        })
    }

    async getApply(@Body() body: any): Promise<ApplyInfo[]> {
        return await this.applyInfoRepository.query(getApply(body.id))
        .then(res =>{
            let obj = {
                code: 200,
                data: res
            }
            return obj
        })
        .catch(err => {
            console.log('getApply err =>', err)
            return err
        });
    }

    async cancel(@Body() body: any): Promise<ApplyInfo[]> {
        let sql = delApply(body)
        let sqlBefore = await this.applyInfoRepository.query(sql.sqlBefore);
        console.log("调用取消报名", sqlBefore)
        if (sqlBefore.length > 0) {
            await this.applyInfoRepository.query(sql.deldateSql)
            return await this.applyInfoRepository.query(sql.updateSql)
            .then(res =>{
                let obj = {
                    code: 200,
                    data: res
                }
                return obj
            })
            .catch(err => {
                console.log('cancel err =>', err)
                return err
            });
        } else {
            return await this.applyInfoRepository.query(sql.insertSql)
            .then(res =>{
                let obj = {
                    code: 200,
                    data: res
                }
                return obj
            })
            .catch(err => {
                console.log('cancel err =>', err)
                return err
            });
        }
    }

    // TODO:需要考虑验证问题
    async modifyApplySwitch(@Body() body: any): Promise<ApplyInfo[]> {
        return await this.applyInfoRepository.query(modifyApplySwitch(body))
        .then(res =>{
            let obj = {
                code: 200,
                data: res
            }
            return obj
        })
        .catch(err => {
            console.log('cancel err =>', err)
            return err
        });
    }

    // 修改报名列表排序
    async modifyApplySort(@Body() body: any) {
        let bodyData = JSON.parse(body.proLabel)
        return await this.applyInfoRepository.query(modifyApplySort(bodyData))
        .then(res =>{
            let obj = {
                code: 200,
            }
            return obj
        })
        // .catch(err => {
        //     console.log('cancel err =>', err)
        //     return err
        // });
    }

    // 定时任务
    async applyInterval(hash: any) {
        const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
        // const rpcProvider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com");
        return await new Promise((resolve, reject) => {
            rpcProvider.waitForTransaction(hash, 1, 4000)   //  4秒等待时长 ==>
            .then((res: any) => { resolve(res) })
            .catch((err: any) => { reject(err) })
        })
        .then(async(res: any) => {
            const ApplyFor = new ethers.utils.Interface(["event ApplyFor(uint256 indexed taskId, address indexed taker, uint256 valuation)"]);

            let decodedData = ApplyFor.parseLog(res.logs[0]);
            const taskId = decodedData.args.taskId.toString();
            const taker = decodedData.args.taker;
            const valuation = decodedData.args.valuation.toString();
            let params = {
                taskId: taskId,
                applyAddr: taker,
                valuation: valuation,
                hash: hash,
            }
            let sql = updateApplyInfo(params)
            // 写入数据库
            let sqlBefore = await this.applyInfoRepository.query(sql.sqlBefore);
            
            let sqlUpdateAI,insertAI;
            if (sqlBefore.length > 0) {
                sqlUpdateAI = await this.applyInfoRepository.query(sql.sqlUpdateAI);
            } else {
                insertAI = await this.applyInfoRepository.query(sql.insert);
            }
            return {
                code: 'SUCCESS'
            }
        })
        .catch(err => {
            return {
                code: 'ERROR'
            }
        })
    }
}
