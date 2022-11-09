import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getTaskHash, createTaskSql,createOrderSql, getApplyForHash, getCancelApplyHash, getCreateOrderHash} from 'src/app/db/sql/sql';
import { updateApplyInfo, cancelApply } from 'src/app/db/sql/sql';
import { ApplyInfo } from '../db/entity/ApplyInfo';
const { ethers } = require('ethers');
// TODO:更改配置文件
// const rpcProvider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/d3fe47cdbf454c9584113d05a918694f");
const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
// const rpcProvider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com");


// 信息同步hash表：待同步类型：1.创建需求 2.修改需求 3.报名 4.修改报名 5.取消报名, 6.创建订单或者修改订单

@Injectable()
export class ResolutionService {
    constructor(
        @InjectRepository(ApplyInfo)
        private readonly applyInfoRepository: Repository<ApplyInfo>
    ) {}

    private readonly logger = new Logger(ResolutionService.name)


}
