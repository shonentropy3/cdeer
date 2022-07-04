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
import { ethers } from 'ethers';
const { contractAddress , address} = require('../../../deployments/Project.json')
const contractabi = require('../../../deployments/abi/Project.json')
const abi = contractabi.abi


@Injectable()
export class MarketService {
    // constructor(private readonly http: HttpService) {}
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
    getFile(files) {

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
                            console.log(err);
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
    pushFile(file,obj) {
        if (obj === false) {
            // return '未上传图片'
            return
        }

        // 上传upyun
        // client.putFile(obj.hash, file[0].buffer)

        // 删除文件
        fs.unlink(obj.path, (err) => {
            if (err) throw err;
            // console.log('文件已删除');
        });

        // 存入数据库
        return  obj
    }


    getMarketList(): string{
        
        return
    }


    // 创建项目
    async createPjc(body) {
        console.log(body);


    // let queryData = body;
    // let{proType,pro} = queryData;
    // const {ethereum} = window;
    // try {
    //     if (ethereum) {
    //       const provider = new ethers.providers.Web3Provider(ethereum);
    //       const signer = provider.getSigner();
    //       const nftContract = new ethers.Contract(contractAddress.address, abi, signer);
    //       getAccountInfo.insertLabel(proType)

    //       //Project publishing fee
    //       let fee = ethers.utils.parseUnits('1', 18);
    //       let nftTxn = await nftContract.createProject({
    //         title: pro[0].value,
    //         budget: Number(pro[1].value),
    //         desc: pro[3].value,
    //         period: Number(pro[2].value)
    //       },
    //        {
    //         value: fee
    //        });
    //       await nftTxn.wait();
    //     } else {
    //       console.log("Ethereum object does not exist");
    //     }
  
    //   } 
    //   catch (err) {
    //     ctx.response.body = _fail(err);
    //     return;
    //   }
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
