import { HttpService } from '@nestjs/axios';
import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { createWriteStream } from 'fs';
import { from, map, Observable, tap, throwError, lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tasks } from '../db/entity/Tasks';	//引入entity
import { Nfts } from '../db/entity/Nfts';
import { ApplyInfo } from '../db/entity/ApplyInfo';
// ipfs/upyun
const fs  = require('fs');
var upyun = require("upyun")
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
const service = new upyun.Service('ipfs0','upchain', 'upchain123')
const client = new upyun.Client(service);
// dbUtils
import { getMyPjcDBa, getMyPjcDBb } from '../db/sql/demand';
import { getApply, getMyApplylist } from '../db/sql/apply_info';
import { getCacheNfts, hasNft, isOutTime, setNftlist, updateNftlist } from '../db/sql/nft';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Tasks)
        private readonly tasksRepository: Repository<Tasks>,
        @InjectRepository(Nfts)
        private readonly nftsRepository: Repository<Nfts>,
        @InjectRepository(ApplyInfo)
        private readonly applyInfoRepository: Repository<Nfts>,
        private httpService: HttpService
    ) {}

    // 查看个人项目
    async getMyDemand(@Body() body: any) {
        if (body.hash) {
          return await this.tasksRepository.query(getMyPjcDBa(body.hash));
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
        let obj = await this.applyInfoRepository.query(getMyApplylist(body[i].task_id))
        newArr.push(obj[0])
      }
      return newArr
    }

    async getMyApplylist(@Body() body: any) {
      return this.tasksRepository.query(getMyApplylist(body.demandId));
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
