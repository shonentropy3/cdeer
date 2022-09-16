import { Body, Controller, Get, Post, Request, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MarketService } from '../service/demand';


@Controller('demand')
export class MarketController {
    constructor(private readonly marketService: MarketService){}

    @Post('createDemand')  // 发布需求
    async createProject(@Body() body: any){
        return await this.marketService.createDemand(body)
    }
    
    @Post('createOrder')  // 发布需求
    async createOrder(@Body() body: any){
        return await this.marketService.createOrder(body)
    }
    
    @Post('modifyDemand')  // 修改需求
    async modifyDemand(@Body() body: any){
        return await this.marketService.modifyDemand(body)
    }

    @Post('deleteDemand')  // 删除需求
    async deleteDemand(@Body() body: any){
        return await this.marketService.deleteDemand(body)
    }

    @Get('getDemand')  // 展示需求列表
    async getDemand(){
        return await this.marketService.getDemand()
    }

    @Get('getSearch')  // 展示搜索列表
    async getSearch(@Request() request: any){
        const name = request.query.name
        return await this.marketService.getSearch(name)
    }

    @Get('getOrder')  // 展示需求列表
    async getOrder(@Request() request: any){
        const account = request.query.account;
        return await new Promise ((resolve,reject)=>{
            resolve(this.marketService.getOrder(account))
         })
         .then((res)=>{
            return this.marketService.getTask(res)
         })
    }

    @Get('getOrdersInfo')  // 展示需求详情
    async getOrdersInfo(@Request() request: any){
        const oid = request.query.oid;
        return await new Promise ((resolve,reject)=>{
            resolve(this.marketService.getOrder(oid))
         })
         .then((res)=>{
            return this.marketService.getTask(res)
         })
    }

    
    @Post('getDemandInfo')  // 查看需求详情
    async getDemandInfo(@Body() body: any){
        return await this.marketService.getDemandInfo(body)
    }

    @Post('getFilter')  // 查看需求详情
    async getFilter(@Body() body: any){
        return await this.marketService.getFilter(body)
    }
}