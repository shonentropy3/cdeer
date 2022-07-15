import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplyInfo } from '../db/entity/ApplyInfo';	
@Injectable()
export class ApplyforService {
    constructor(
        @InjectRepository(ApplyInfo)
        private readonly projectRepository: Repository<ApplyInfo>,
    ) {}


    async applyFor(@Body() body: any): Promise<ApplyInfo[]> {
        let bodyData = JSON.parse(body.proLabel)
        let
        return body
    }
}
