import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import {HttpService} from '@nestjs/axios'
import { AxiosError, AxiosResponse } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { createWriteStream } from 'fs';
import { join, resolve } from 'path/posix';
const fs  = require('fs');
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
        let hash = 'chu'
        new Promise((resolve, reject) => {
            const file = files[0]
            let time = `${Date.now()}-${file.originalname}`
            let path = '../../../public'+'/'+ time
            let writeStream = createWriteStream(join(__dirname, path))
            writeStream.write(file.buffer , function (err) {
                if (!err) {
                    resolve (time)
                }
            })
        })
        .then((time) =>{
            // return this.add(time)
            let res = '/Users/xiaonahe/Desktop/work/code-market/code-market/public/'+time
            ipfs.add(fs.readFileSync(res),   function (err, files) {
                if (err || typeof files == "undefined") {
                    console.log(err);
                } else {
                    console.log(files[0].hash);
                    return (files[0].hash)
                    resolve(hash = files[0].hash)
                }
            })
        })
        .then(res => {
            console.log('3==>',hash);
            
            return 'xx'
        })
    }

    add(time){
        return new Promise((resolve,reject)=>{
            try {
                let res = '/Users/xiaonahe/Desktop/work/code-market/code-market/public/'+time
                ipfs.add(fs.readFileSync(res), function (err, files) {
                    if (err || typeof files == "undefined") {
                        reject(err);
                    } else {
                        console.log(files[0].hash);
                        resolve(files[0].hash);
                    }
                })
            }catch(ex) {
                reject(ex);
            }
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
