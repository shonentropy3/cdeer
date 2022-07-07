import { HttpService } from '@nestjs/axios';
import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path/posix';
import { map, Observable, tap, throwError } from 'rxjs';
const fs  = require('fs');
var upyun = require("upyun")
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
const service = new upyun.Service('ipfs0','upchain', 'upchain123')
const client = new upyun.Client(service);


import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entity/Order';	//引入entity
import { Project } from '../../entity/Project';	//引入entity
import { ethers } from 'ethers';

@Injectable()
export class MarketService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>
        ) {}
    // findOne(@Body() body: any) {
    //     // return this.usersService.findOne(body.username);
    //     console.log(body);
    //     return body
    // }

    // testPort(): Observable<any> {
    //     return this.http
    //       .get(`http://127.0.0.1:3000/codemarket/app`)
    //       .pipe(
    //         tap((res) => (`Status: ${res.status}`)),
    //         map((res) => res.data)
    //       );
    //   }

    // 获取hash
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


    async test(): Promise<Order[]> {
        // return await this.orderRepository.query(`SELECT * FROM public."order"`);
        let list: any[] = [1, true, "free"];
        // list[1] = 100;
        return list
    }

    // 获取所有项目
    async getMarketData(): Promise<Project[]> {
        return await this.projectRepository.query(`SELECT * FROM public."project"`);
    }

    // 获取项目详情
    async getProjectDetail(@Body() body: any): Promise<Project[]> {
        return await this.projectRepository.query(`SELECT * FROM public.project WHERE token_id = '${body.id}'`);
    }

    // 创建项目
    async createPjc(@Body() body: any): Promise<Project[]>  {
        let jp = JSON.parse(body.proLabel);
        console.log(jp);
        // let nftTxn = await nftContract.createDemand({
            // title: pro[0].value,
            // budget: Number(pro[1].value),
            // desc: pro[3].value,
            // period: Number(pro[2].value)
        //   },
        // console.log(window);
        return await body
    // let queryData = body;
    // let{proType,pro} = queryData;
    // const {ethereum} = window;

    // return ctx.response.body = _succeed();
        
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
