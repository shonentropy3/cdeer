import { HttpService } from '@nestjs/axios';
import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path/posix';
import { from, map, Observable, tap, throwError, lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tasks } from '../db/entity/Tasks';	//引入entity
import { Nfts } from '../db/entity/Nfts';
// ipfs/upyun
const fs  = require('fs');
var upyun = require("upyun")
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
const service = new upyun.Service('ipfs0','upchain', 'upchain123')
const client = new upyun.Client(service);
// dbUtils
import { getMyPjcDBa, getMyPjcDBb } from '../db/sql/demand';
import { getMyApplylist } from '../db/sql/apply_info';
import { getNftlist, setNftlist } from '../db/sql/nft';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Tasks)
        private readonly tasksRepository: Repository<Tasks>,
        @InjectRepository(Nfts)
        private readonly nftsRepository: Repository<Nfts>,
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

    async getMyApplylist(@Body() body: any) {
      return this.tasksRepository.query(getMyApplylist(body.demandId));
    } 

    async getCacheNfts(body: any){
      let params = body.params;
      let arr = [];
      let state = false;
      await this.nftsRepository.query(getNftlist(params.account))
      .then(res => {
        res.length === 0 ? state = false : state = true;
        res.map(e => {
          if (e.info !== null) {
            arr.push(e.info)
          }
        })
      })
      
      return {state: state, data: arr}
    }


    async getNft(body: any) {
      await this.getNftscanErc721(body);
      await this.getNftscanErc1155(body);
    }

    async getNftscanErc721(body: any) {
      let params = body.params;
      params.erc_type = 'erc721';
      return this.getNftscan(params)
    }
    
    async getNftscanErc1155(body: any) {
      let params = body.params;
      params.erc_type = 'erc1155';
      return this.getNftscan(params)
    }


    async getNftscan(body: any) {
      let params = body;
      const checkResultObservable = this.httpService.get(
        `https://${params.chain}.nftscan.com/api/v2/account/own/${params.account}?erc_type=${params.erc_type}`,
        { headers: { 'X-API-KEY': 'Ovzh6fBZ' } }
      )
      const checkResult = await (await lastValueFrom(checkResultObservable)).data;
      const data = checkResult.data.content;
      if (checkResult.code === 200) {
        return this.nftsRepository.query(setNftlist(data,params));
      }
            // .pipe(
      //   map(response => {
      //     let data = response.data
      //     console.log('data==>',data);
          
      //     // if (data.code === 200) {
      //     //   // ERC1155: owner赋值  ==>   因json查询速度慢遂另外存储account
      //     //   // if (params.erc_type === 'erc1155') {
      //     //   //   data.data.content.map(e => {
      //     //   //     e.owner = params.account
      //     //   //   })
      //     //   // }
      //     //   // console.log('===>',setNftlist(data.data.content,params));
      //     //   // // return
      //     //   // return this.nftsRepository.query(setNftlist(data.data.content,params));
      //     // }
      //   }), 
      //   )
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
