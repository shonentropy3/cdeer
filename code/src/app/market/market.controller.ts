import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
    createProject(@Body() body: any){
        // return this.marketService.createPjc(body)
    }
}
