import { HttpService } from '@nestjs/axios';
import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path/posix';
import { from, map, Observable, tap, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Demand } from '../db/entity/Demand';	//引入entity

// ipfs/upyun
const fs  = require('fs');
var upyun = require("upyun")
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
const service = new upyun.Service('ipfs0','upchain', 'upchain123')
const client = new upyun.Client(service);
// dbUtils
import { getMyPjcDBa, getMyPjcDBb } from '../db/sql/demand';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Demand)
        private readonly demandRepository: Repository<Demand>,
    ) {}

    // 查看个人项目
    async getMyDemand(@Body() body: any) {
        // console.log(body);
        if (body.hash) {
          return await this.demandRepository.query(getMyPjcDBa(body.hash));
        }else{
          return await this.demandRepository.query(getMyPjcDBb(body.demand_id));
          
        }
        
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
