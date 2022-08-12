import { Body, Controller, Get, Post, Request, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CommonService } from '../service/common';


@Controller('common')
export class CommonController {
    constructor(private readonly commonService: CommonService){}

    @Post('upload') //   上传文件
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFile(@UploadedFiles() files: any){
        return await new Promise ((resolve,reject)=>{
            resolve(this.commonService.getFile(files))
         })
         .then((res)=>{
            return this.commonService.pushFile(files, res)
         })
    }

    // @Get('download') //   下载文件
    // async downloadFile(@Request() request: any){
    //     let hash = request.query.hash;
    //     return this.commonService.downloadFile(hash)
    // }
}