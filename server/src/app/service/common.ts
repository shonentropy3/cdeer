import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path/posix';
import { throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { Tasks } from '../db/entity/Tasks';

const fs  = require('fs');
var upyun = require("upyun")
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
const service = new upyun.Service('ipfs0','upchain', 'upchain123')
const client = new upyun.Client(service);


// var fs = require("fs");
var path = require("path");
var request = require("request");


import { getStageJson, updateStageJson, getStages, updateJson } from '../db/sql/demand';

@Injectable()
export class CommonService {
    constructor(
        @InjectRepository(Tasks)
        private readonly tasksRepository: Repository<Tasks>,
    ) {}

    // Get hash
    getFile(files: any) {
        if (files.length === 0 ) {
            return false
        }
        return new Promise((resolve, reject) => {
            const file = files[0]
            let time = `${Date.now()}-${file.originalname}`
            // let time = `${Date.now()}-${file.name}`
            let path = '../../../cache_area'+'/'+ time
            // let path = 'cache_area'+'/'+ time
            let writeStream = createWriteStream(join(__dirname, path))
            writeStream.write(file.buffer, function (err) {
                if (!err) {
                    let res = 'cache_area/'+ time
                    
                    ipfs.add(fs.readFileSync(res), function (err, files) {
                        
                        if (err || typeof files == "undefined") {
                            console.log('Ipfs writeStream err==>', err);
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
    pushFile(file: any, obj: any) {
        if (obj === false) {
            console.log('未上传附件');
            return
        }
        // 上传upyun
        client.putFile(obj.hash, file[0].buffer)
        .then(res => {
            console.log('上传upyun ===>', res);
            return true
        })
        .catch(err => {
            console.log('上传upyun ===>',err);
            return false
        })
        fs.unlink(obj.path, (err) => {
            if (err) throw err;
        });
        return obj.hash
    }

    // 下载
    downloadFile(body: any){     
        const saveTo = fs.createWriteStream(join('Download', body.suffix))
        client.getFile(body.hash,saveTo)
        .then(res =>{
            // file has been saved to localSample.txt
            // you can pipe the stream to anywhere you want
            console.log(res);
        })
        .catch(err => {
            return 'error'
        })
    }

    // Get stage hash
    getStage(body: any){
        return new Promise((resolve, reject) => {
        let time = Date.now()+'.json'
        let path = './cache_area'+'/'+time
        fs.writeFile(path, body.obj, function (err) {
            if (err) {
                console.error(err);
            }else{
                let res = 'cache_area/'+ time
                    
                    ipfs.add(fs.readFileSync(res), function (err, files) {
                        
                        if (err || typeof files == "undefined") {
                            console.log('Ipfs writeStream err==>', err);
                        } else {
                            let obj = {
                                hash: files[0].hash,
                                path: res
                            }
                            // 上传upyun
                            client.putFile(obj.hash, fs.readFileSync(res))
                            .then(res => {
                                console.log(res);
                                
                                return true
                            })
                            .catch(err => {
                                console.log(err);
                                
                                return false
                            })
                            fs.unlink(res, (err) => {
                                if (err) throw err;
                            });
                            resolve(obj)
                        }
                    })
            }
            
        })
    }).then(async(res)=>{
        return await this.tasksRepository.query(updateStageJson({json: res, oid: body.oid, info: body.info, stages: body.stages}))
        .then(() => {
            return {
                code: 200
            }
        })
        .catch(err => {
            console.log(err);
            
            return {
                code: 500
            }
        })
    }).catch(err => {
        console.log(err);
        
        return false
    })
        // return
        // return body
    }

    async getStagesJson(body: any){
      return new Promise(async(resolve, reject) => {
        await this.tasksRepository.query(getStageJson(body.oid))
        .then(res => {
            
            let hash = res[0].attachment;
            if (!hash) {
                return null
            }
            let time = `${Date.now()}.json`
            let path = '../../../cache_area'+'/'+ time
            let stream = createWriteStream(join(__dirname, path));
            request(`http://ipfs.learnblockchain.cn/${hash}`).pipe(stream).on("close", function (err) {
                // 获取json数据
                if (err) {
                    console.error(err);
                }else{
                    let url = 'cache_area/'+ time;
                    const data = fs.readFileSync(url, 'utf8');
                    let obj = {
                        data: data,
                        url: url
                    }
                    resolve(obj)
                }
            });
            })
        })
        .then((res: any) => {
            fs.unlink(res.url, (err) => {
                if (err) throw err;
            });
            let data = res.data;
            return this.tasksRepository.query(getStages(body.oid))
            .then(stages => {
                let obj = {
                    json: JSON.parse(data),
                    stages: stages[0].stages,
                    signature: stages[0].signature,
                    attachment: stages[0].attachment
                }
                return obj
            })
        })
    }

    async getStages(body: any){
        
    }

    async updateAttachment(body: any){
        return new Promise((resolve, reject) => {
            let time = Date.now()+'.json'
            let path = './cache_area'+'/'+time
            fs.writeFile(path, body.obj, function (err) {
                if (err) {
                    console.error(err);
                }else{
                    let res = 'cache_area/'+ time
                        ipfs.add(fs.readFileSync(res), function (err, files) {
                            
                            if (err || typeof files == "undefined") {
                                console.log('Ipfs writeStream err==>', err);
                            } else {
                                let obj = {
                                    hash: files[0].hash,
                                    path: res
                                }
                                // 上传upyun
                                client.putFile(obj.hash, fs.readFileSync(res))
                                .then(res => {
                                    return true
                                })
                                .catch(err => {
                                    console.log(err);
                                    
                                    return false
                                })
                                fs.unlink(res, (err) => {
                                    if (err) throw err;
                                });
                                resolve(obj)
                            }
                        })
                }
                
            })
        }).then(async(res)=>{
            return await this.tasksRepository.query(updateJson({json: res, oid: body.oid}))
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
