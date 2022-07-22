import { HttpService } from '@nestjs/axios';
import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path/posix';
import { from, map, Observable, tap, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tasks } from '../db/entity/Tasks';	//引入entity

// ipfs/upyun
const fs  = require('fs');
var upyun = require("upyun")
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
const service = new upyun.Service('ipfs0','upchain', 'upchain123')
const client = new upyun.Client(service);
// dbUtils
import { getDemandDate, getDemandInfoDate, setDemand, moDemand, delDemand } from '../db/sql/demand';


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
        
        return await this.tasksRepository.query(setDemand(bodyData))
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
