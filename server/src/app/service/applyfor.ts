import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplyInfo } from '../db/entity/ApplyInfo';	
@Injectable()
export class ApplyforService {
    constructor(
        @InjectRepository(ApplyInfo)
        private readonly applyInfoRepository: Repository<ApplyInfo>,
    ) {}


    async apply(@Body() body: any): Promise<ApplyInfo[]> {
        let bodyData = JSON.parse(body.proLabel)
        let sql = `					 
            insert into apply_info("apply_addr", demand_id, preview_price) 
            VALUES ('${bodyData.applyAddr}', ${bodyData.demandId}, ${bodyData.previewPrice});
        `;
        
        return await this.applyInfoRepository.query(sql)
    }

    async getApply(@Body() body: any): Promise<ApplyInfo[]> {
        let sql = `SELECT * FROM apply_info WHERE apply_addr = '${body.id}' `
        console.log('=======',sql);
        
        return await this.applyInfoRepository.query(sql)
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
    


    // async cancel(@Body() body: any): Promise<ApplyInfo[]> {
    //     let bodyData = JSON.parse(body.proLabel)
    //     // let
    //     return body
    // }
    
    // async applySwitch(@Body() body: any): Promise<ApplyInfo[]> {
    //     let bodyData = JSON.parse(body.proLabel)
    //     // let
    //     // 就是从订单页跳转到增加地址页，回到订单页后地址是选中状态
    //     return body
    // }
}
