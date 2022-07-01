import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import {HttpService} from '@nestjs/axios'
import { AxiosError, AxiosResponse } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { createWriteStream } from 'fs';
import { join, resolve } from 'path/posix';
const fs  = require('fs');
var upyun = require("upyun")
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});



@Injectable()
export class UserService {
    constructor(private readonly http: HttpService) {}
    findOne(@Body() body: any) {
        // return this.usersService.findOne(body.username);
        console.log(body);
        return body
    }


    testPort(): Observable<any> {
        return this.http
          .get(`http://127.0.0.1:3000/codemarket/app`)
          .pipe(
            tap((res) => (`Status: ${res.status}`)),
            map((res) => res.data)
          );
      }


    getFile(files) {
        // console.log('files==>',files);
        
        return new Promise((resolve, reject) => {
            const file = files[0]
            let time = `${Date.now()}-${file.originalname}`
            // let time = `${Date.now()}-${file.name}`
            let path = '../../../public'+'/'+ time
            let writeStream = createWriteStream(join(__dirname, path))
            writeStream.write(file.buffer , function (err) {
                if (!err) {
                    let res = '/Users/xiaonahe/Desktop/work/code-market/code/public/'+time
                    // resolve(res)
                    ipfs.add(fs.readFileSync(res),   function (err, files) {
                        if (err || typeof files == "undefined") {
                            console.log(err);
                        } else {
                            resolve(files[0].hash)
                        }
                    })
                }
            })
        }).then((res)=>{
            return res
        })
    }

    addFile(file,hash) {
        console.log('file==>',file);
        console.log('hash==>',hash);
        // TODO: 上传upyun ==> 删除本地文件
        const service = new upyun.Service('ipfs0','upchain', 'upchain123')
        const client = new upyun.Client(service);
        // client.putFile(hash, file[0].buffer)

        
        let obj = {
            code: 0,
            message: "请求成功",
            data:{
                hash:hash
            }
        }
        return  obj
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
