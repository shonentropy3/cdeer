import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplyInfo } from '../db/entity/ApplyInfo';	
import { Users } from '../db/entity/Users';
import { setApply, getApply, delApply, modifyApplySwitch, setApplylist, getMyApply, updateApply, modifyApplySort } from '../db/sql/demand';
import { getMyInfo, modifyContacts, setContacts } from '../db/sql/user';
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

        await this.applyInfoRepository.query(setApply(bodyData))

        await this.applyInfoRepository.query(getMyApply(bodyData))
        .then(res => {
            if (res.length === 0) {
                this.applyInfoRepository.query(setApplylist(bodyData))
            }else{
                this.applyInfoRepository.query(updateApply(bodyData))
            }
        })

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
}
