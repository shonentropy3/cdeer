import { HttpService } from '@nestjs/axios';
import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path/posix';
import { from, map, Observable, tap, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../db/entity/Project';	//引入entity

const fs  = require('fs');
var upyun = require("upyun")
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
const service = new upyun.Service('ipfs0','upchain', 'upchain123')
const client = new upyun.Client(service);


@Injectable()
export class CommonService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
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
        })
        .catch(err => {
            console.log('上传upyun ===>',err);
        })
        fs.unlink(obj.path, (err) => {
            if (err) throw err;
        });
        return obj.hash
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
