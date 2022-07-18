import { HttpService } from '@nestjs/axios';
import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path/posix';
import { from, map, Observable, tap, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../db/entity/Project';	//引入entity

// ipfs/upyun
const fs  = require('fs');
var upyun = require("upyun")
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
const service = new upyun.Service('ipfs0','upchain', 'upchain123')
const client = new upyun.Client(service);
// dbUtils
import { getDemandDate, getDemandInfoDate } from '../db/sql/demand';


@Injectable()
export class MarketService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) {}

    // 获取需求列表
    async getDemand(): Promise<Project[]> {
        return await this.projectRepository.query(getDemandDate())
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
    async getDemandInfo(@Body() body: any): Promise<Project[]> {
        let id = Number(body.id)
        return await this.projectRepository.query(getDemandInfoDate(id))
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
    async createDemand(@Body() body: any): Promise<Project[]> {
        let bodyData = JSON.parse(body.proLabel);
        let sql = `					 
            insert into project(user_address,title,budget,period,"content",role,pro_type, status, attachment) 
            VALUES (${bodyData.u_address},'${bodyData.title}',${bodyData.budget},${bodyData.period},'${bodyData.pro_content}',
            ${bodyData.recruiting_role},${bodyData.pro_type},2,'${bodyData.hash}');
        `;
        return await this.projectRepository.query(sql)
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
    async modifyDemand(@Body() body: any): Promise<Project[]>  {
        let bodyData = JSON.parse(body.proLabel);
        let sql = `					 
            update project SET title = '${bodyData.title}', budget = ${bodyData.budget}, period = ${bodyData.budget} ,
            "content" = '${bodyData.pro_content}' ,role = '${bodyData.recruiting_role}' ,pro_type = '${bodyData.pro_type}',
            attachment = '${bodyData.attachment}' ,status = 3 ,update_time = now() where pro_id = ${bodyData.pro_id};
        `;
        console.log("modifyDemandsql------", sql);
        
        return await this.projectRepository.query(sql)
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
    async deleteDemand(@Body() body: any): Promise<Project[]>  {
        let data = body.data
        let sql = `
            UPDATE project SET status = 0  WHERE id = ${data.id};
        `;
        return await this.projectRepository.query(sql)
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
