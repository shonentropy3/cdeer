import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MarketService } from './market.service';



@Controller('market')
export class MarketController {
    constructor(private readonly marketService: MarketService){}

    @Post('upload') //  暂存文件 => 获取hash => 删除文件 => 存入数据库
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(@UploadedFiles() files){

        return new Promise ((resolve,reject)=>{
            resolve(this.marketService.getFile(files))
         })
         .then((res)=>{
            return this.marketService.pushFile(files,res)
         })
         
    }

    @Post('publish')  //  创建项目
    async createProject(@Body() body: any){
        return await this.marketService.createPjc(body)
    }

    @Get('getMarketData')  //  获取集市项目
    async getProject(){
        return await this.marketService.getPjc()
    }

    @Get('search')  //  搜索
   	async getMarketList(){
        return await this.marketService.test()
    }

    @Post() //  测试
    createCat(@Body() body: any): string {
      return `接受到的createCatDto的数据name:${body.name}&age:${body.age}`;
    }

}
