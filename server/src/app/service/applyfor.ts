import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplyInfo } from '../db/entity/ApplyInfo';	
import { setApply, getApply, delApply } from '../db/sql/demand';
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
        return await this.applyInfoRepository.query(delApply(body.demand_id))
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
    
    // async applySwitch(@Body() body: any): Promise<ApplyInfo[]> {
    //     let bodyData = JSON.parse(body.proLabel)
    //     // let
    //     // 就是从订单页跳转到增加地址页，回到订单页后地址是选中状态
    //     return body
    // }
}
