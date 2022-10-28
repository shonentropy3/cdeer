import { HttpService } from '@nestjs/axios';
import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { createWriteStream } from 'fs';
import { from, map, Observable, tap, throwError, lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Code, Repository } from 'typeorm';
import { Tasks } from '../db/entity/Tasks';	//引入entity
import { Nfts } from '../db/entity/Nfts';
import { ApplyInfo } from '../db/entity/ApplyInfo';
import { Users } from '../db/entity/Users';
// ipfs/upyun
const fs  = require('fs');
var upyun = require("upyun")
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
const service = new upyun.Service('ipfs0','upchain', 'upchain123')
const client = new upyun.Client(service);
// dbUtils
import { getDemandInfoDate, getMyPjcDBa, getMyPjcDBb, getMyTaskIsn, getTaskApplyCount } from '../db/sql/demand';
import { getApply, getMyApplylistA, getMyApplylistB } from '../db/sql/apply_info';
import { getCacheNfts, hasNft, isOutTime, setNftlist, updateNftlist } from '../db/sql/nft';
import { getMyInfo, modifyMyInfo, setMyInfo } from '../db/sql/user';
import { resolve } from 'path';
import { rejects } from 'assert';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Tasks)
        private readonly tasksRepository: Repository<Tasks>,
        @InjectRepository(Nfts)
        private readonly nftsRepository: Repository<Nfts>,
        @InjectRepository(ApplyInfo)
        private readonly applyInfoRepository: Repository<Nfts>,
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        private httpService: HttpService
    ) {}

    // 查看个人项目
    async getMyDemand(@Body() body: any) {
        if (body.hash) {
          return new Promise(async(resolve, reject) => {
            this.tasksRepository.query(getMyPjcDBa(body.hash))
            .then(res => {
              res.map(async(e,i) => {
                await this.tasksRepository.query(getTaskApplyCount(e.id))
                .then(arr => {
                  e.apply_count = arr.length
                  if (i+1 === res.length) {
                    resolve(res)
                  }
                })
              })
            })
          })
          .then((res: any) => {
            let arr = res;
            return this.tasksRepository.query(getMyTaskIsn(body.hash))
            .then(res => {
              if (res.length > 0) {
                arr.push.apply(arr, res);
              }
              return arr
            })
          })
        }else{  
          return await this.tasksRepository.query(getMyPjcDBb(body.demand_id));
        }
    } 

    async getApply(@Body() body: any) {
        return await this.applyInfoRepository.query(getApply(body.hash));
    } 

    async getApplyList(@Body() body: any) {
      let newArr = [];
      for (let i = 0; i < body.length; i++) {
        let obj = await this.tasksRepository.query(getDemandInfoDate(body[i].task_id))
        newArr.push(obj[0])
      }
      return newArr
    }

    async getMyApplylist(@Body() body: any) {
      let obj = {
        normal: [],
        sort: []
      };
      return this.tasksRepository.query(getMyApplylistA(body.demandId))
              .then(res => {
                obj.normal = res;
                return this.tasksRepository.query(getMyApplylistB(body.demandId))
                .then(res => {
                  obj.sort = res;
                  return obj;
                })
                
              })
    } 


    // psql中是否有该账户nft缓存
    async hasNft(body: any) {
      let params = body.params;
      return this.nftsRepository.query(hasNft(params.account))
      .then(res => {
        if (res.length === 0) {
          // 没有
          return false
        }else{
          return true
        }
      })
    }

    // 该账户nft缓存是否超时
    async isOutTime(body: any) {
      let params = body.params;
      params.time = Date.now();
      return this.nftsRepository.query(isOutTime(params))
      .then(res => {
        if (res.length === 0) {
          // 没有超时
          return true
        }else{
          return false
        }
      })
    }

    async getCacheNftsList(body: any){
      let params = body.params;
      return this.nftsRepository.query(getCacheNfts(params))
      .then(res => {
        let arr = [];
        res.map(e => {
          if (e.info !== null) {
            arr.push(e.info)
          }
        })
        return arr;
      })
    }

    async setNftCache(body: any) {
      for (let i = 0; i < body.length; i++) {
        this.nftsRepository.query(setNftlist(body[i]))
      }
    }

    async updateNftCache(body: any) {
      for (let i = 0; i < body.length; i++) {
        this.nftsRepository.query(updateNftlist(body[i]))
      }
    }

    async getNftscan(body: any) {
      let params = body.params;
      const arr = ['erc721','erc1155'];
      let detail = []
      for (let i = 0; i < arr.length; i++) {
        const checkResultObservable = this.httpService.get(
          `https://${params.chain}.nftscan.com/api/v2/account/own/${params.account}?erc_type=${arr[i]}`,
          { headers: { 'X-API-KEY': 'Ovzh6fBZ' } }
        )
        const checkResult = await (await lastValueFrom(checkResultObservable)).data;
        const data = checkResult.data.content;
        detail.push({
          erc_type: arr[i], data: data, account: params.account, chain: params.chain
        })
      }
      return detail
    }


    // 个人资料

    // 设置个人资料
    async setMyInfo(@Body() body: any) {
      return await this.usersRepository.query(setMyInfo(body))
      .then(res => {
        return {
          code: 200
        }
      })
    }

    // 修改个人资料
    async modifyMyInfo(@Body() body: any) {
      return await this.usersRepository.query(modifyMyInfo(body))
      .then(res => {
        return {
          code: 200
        }
      })
    }


    // 获取个人资料
    async getMyInfo(@Body() body: any){
      return await this.usersRepository.query(getMyInfo(body.address))
      .then(res => {
          return {
            code: 200,
            data: res
        }
      })
    }


    // 获取所有报名人员的个人信息
    async getApplicationInfo(@Body() body: any){
      let allInfo = [];
      for ( let i = 0; i < body.address.length; i++ ) {
        await this.usersRepository.query(getMyInfo(body.address[i]))
        .then(res => {
          allInfo.push(res[0])
        })
      }
      return allInfo
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
