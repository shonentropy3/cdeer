import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tasks } from '../db/entity/Tasks';	//引入entity

// dbUtils
import { getDemandDate, getDemandInfoDate, setDemand, moDemand, delDemand, getFilter } from '../db/sql/demand';


@Injectable()
export class MarketService {
    constructor(
        @InjectRepository(Tasks)
        private readonly tasksRepository: Repository<Tasks>,
    ) {}

    // 获取需求列表
    async getDemand(): Promise<Tasks[]> {
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
    async createDemand(@Body() body: any): Promise<Tasks[]> {
        let bodyData = JSON.parse(body.proLabel);
        
        let sql = setDemand(bodyData)
        try {
            let sqlResult = await this.tasksRepository.query(sql.sql);
            if (-1 != sqlResult[1]) {
                return await this.tasksRepository.query(sql.sqlHash)
                .then(res => {
                    let obj = {
                        code: 200
                    }
                    return obj
                })
                .catch(err => {
                    console.log('createDemand err =>', err);
                    return err
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    // 修改需求
    async modifyDemand(@Body() body: any): Promise<Tasks[]>  {
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
        let data = body.data
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
