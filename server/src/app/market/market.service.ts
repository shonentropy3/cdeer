import { HttpService } from '@nestjs/axios';
import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path/posix';
import { from, map, Observable, tap, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entity/Project';	//引入entity

// ipfs/upyun
const fs  = require('fs');
var upyun = require("upyun")
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
const service = new upyun.Service('ipfs0','upchain', 'upchain123')
const client = new upyun.Client(service);
// dbUtils
import { getMarketDB } from '../db/dbutils';
import { getProjectDB } from '../db/dbutils';


@Injectable()
export class MarketService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) {}
    // testPort(): Observable<any> {
    //     return this.http
    //       .get(`http://127.0.0.1:3000/codemarket/app`)
    //       .pipe(
    //         tap((res) => (`Status: ${res.status}`)),
    //         map((res) => res.data)
    //       );
    //   }

    

    // getHash
    getFile(files: any) {
        
        if (files.length === 0 ) {
            return false
        }
        return new Promise((resolve, reject) => {
            
            const file = files[0]
            let time = `${Date.now()}-${file.originalname}`
            // let time = `${Date.now()}-${file.name}`
            let path = '../../../public'+'/'+ time
            // let path = 'public'+'/'+ time
            
            let writeStream = createWriteStream(join(__dirname, path))
            writeStream.write(file.buffer , function (err) {
                if (!err) {
                    let res = 'public/'+ time
                    ipfs.add(fs.readFileSync(res),   function (err, files) {
                        if (err || typeof files == "undefined") {
                            console.log('err==>',err);
                        } else {
                            let obj = {
                                hash: files[0].hash,
                                path: res
                            }
                            resolve(obj)
                        }
                    })
                }
            })
        }).then(res=>{
            return res
        }).catch(() => {
            
            return false
        })
    }

    // 传入数据库
    pushFile(file: any,obj: any) {
        if (obj === false) {
            // return '未上传图片'
            console.log('未上传图片');
            return
        }

        // 上传upyun
        // client.putFile(obj.hash, file[0].buffer)

        // 删除文件
        fs.unlink(obj.path, (err) => {
            if (err) throw err;
            // console.log('文件已删除');
        });
        console.log(obj);
        
        // 存入数据库
        return  obj
    }

    // 获取所有项目
    async getMarketData(): Promise<Project[]> {
        return await this.projectRepository.query(getMarketDB());
    }

    // 获取项目详情
    async getProjectDetail(@Body() body: any): Promise<Project[]> {
        return await this.projectRepository.query(getProjectDB(body.id));
    }

    // 创建需求
    async createDemand(@Body() body: any): Promise<Project[]>  {
        let jp = JSON.parse(body.proLabel);
        console.log(jp);
        let sql = `					 
            insert into project(title,budget,period,"content",role,pro_type) 
            VALUES (${jp.title},${jp.budget},${jp.period},${jp.pro_content},${jp.recruiting_role},${jp.pro_type});
        `;
        console.log(sql);
        
        let result = await this.projectRepository.query(sql)
        .then(res=>{
            console.log('res==>成功');
        })
        .catch(err => {
            console.log('err=>错误', err);
        })
        console.log(result);
        
        return await body

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
