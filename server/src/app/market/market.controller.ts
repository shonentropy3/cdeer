import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MarketService } from './market.service';


@Controller('market')
export class MarketController {
    constructor(private readonly marketService: MarketService){}

    @Post('upload') //   上传文件
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFile(@UploadedFiles() files: any){
        return await new Promise ((resolve,reject)=>{
            resolve(this.marketService.getFile(files))
         })
         .then((res)=>{
            return this.marketService.pushFile(files,res)
         })
    }

    @Post('publish')  //  创建项目
    async createProject(@Body() body: any){
        return await this.marketService.createDemand(body)
    }

    @Post('modifyDemand')  //  修改需求
    async modifyDemand(@Body() body: any){
        return await this.marketService.modifyDemand(body)
    }

    @Post('deleteDemand')  //  删除需求
    async deleteDemand(@Body() body: any){
        return await this.marketService.deleteDemand(body)
    }

    @Get('getMarketData')  //  获取集市项目
    async getMarketData(){
        return await this.marketService.getMarketData()
    }

    @Post('projectDetail')  //  获取项目详情
    async projectDetail(@Body() body: any){
        return await this.marketService.getProjectDetail(body)
    }

    @Post('getMyPjcData')  //  获取个人项目
    async getMyPjcData(@Body() body: any){
        return await this.marketService.getMyPjcData(body)
    }

    @Post() //  测试
    createCat(@Body() body: any): string {
      return `接受到的createCatDto的数据name:${body.name}&age:${body.age}`;
    }

}