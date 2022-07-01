import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MarketService } from './market.service';

@Controller('market')
export class MarketController {
    constructor(private readonly marketService: MarketService){}

    @Post('upload') //  暂存文件|获取hash
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(@UploadedFiles() files){

        return this.marketService.getFile(files)

        // return new Promise ((resolve,reject)=>{
        //     this.usersService.getFile(files)
        //     resolve(this.usersService.getFile(files))
        //  })
        //  .then((res)=>{
        //     return this.usersService.addFile(files,res)
        //  })
    }

    @Post('publish')  //  创建项目
    createProject(@Body() body: any){
        // return this.marketService.createPjc(body)
    }
}
