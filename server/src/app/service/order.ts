import { BadRequestException, Body, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from '../db/entity/Orders';	//引入entity
import { setOrder } from '../db/sql/order';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Orders)
        private readonly ordersRepository: Repository<Orders>,
    ) {}

    // 创建订单
    async createOrder(@Body() body: any){
        return await this.ordersRepository.query(setOrder(body))
        .then(res => {
            console.log(res);
            return {
                code: 200
            }
        })
        .catch(err => {
            
        })
    }

    
}
