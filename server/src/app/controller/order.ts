import { Body, Controller, Get, Post, Request, UseInterceptors } from '@nestjs/common';
import { OrderService } from '../service/order';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService){}

    @Post('createOrder')  // 发布需求
    async createOrder(@Body() body: any){
        return await this.orderService.createOrder(body)
    }

}
