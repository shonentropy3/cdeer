import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplyInfo } from '../db/entity/ApplyInfo';	
import { setApply, getApply, delApply, modifyApplySwitch } from '../db/sql/demand';
@Injectable()
export class ApplyforService {
    constructor(
        @InjectRepository(ApplyInfo)
        private readonly applyInfoRepository: Repository<ApplyInfo>,
    ) {}


    async apply(@Body() body: any): Promise<ApplyInfo[]> {
        let bodyData = JSON.parse(body.proLabel)
        return await this.applyInfoRepository.query(setApply(bodyData))
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
        let bodyData = JSON.parse(body.proLabel)
        
        return await this.applyInfoRepository.query(modifyApplySwitch(bodyData))
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
