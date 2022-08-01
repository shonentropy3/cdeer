import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MarketService } from '../service/demand';


@Controller('demand')
export class MarketController {
    constructor(private readonly marketService: MarketService){}

    @Post('createDemand')  // 发布需求
    async createProject(@Body() body: any){
        return await this.marketService.createDemand(body)
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

    @Post('getDemandInfo')  // 查看需求详情
    async getDemandInfo(@Body() body: any){
        return await this.marketService.getDemandInfo(body)
    }

    @Post('getFilter')  // 查看需求详情
    async getFilter(@Body() body: any){
        return await this.marketService.getFilter(body)
    }
}