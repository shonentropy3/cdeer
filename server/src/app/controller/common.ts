import { Body, Controller, Get, Post, Request, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CommonService } from '../service/common';


@Controller('common')
export class CommonController {
    constructor(private readonly commonService: CommonService){}

    @Post('upload') //   上传文件
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFile(@UploadedFiles() files: any){
        console.log('xx');
        
        return await new Promise ((resolve,reject)=>{
            resolve(this.commonService.getFile(files))
         })
         .then((res)=>{
            return this.commonService.pushFile(files, res)
         })
    }

    @Post('download') //   下载文件
    async downloadFile(@Body() body: any){
        this.commonService.downloadFile(body)
    }

    @Post('getHash') //   上传stage 获取hash
    async getHash(@Body() body: any){
        return await this.commonService.getStage(body)
    }

    // getStagesJson
    @Post('getStagesJson') //   获取hash 并下载获取内容后,返回内容,删除下载文件
    async getStagesJson(@Body() body: any){
        return await this.commonService.getStagesJson(body)
    }

    @Post('updateAttachment') 
    async updateAttachment(@Body() body: any){
        return await this.commonService.updateAttachment(body)
    }

    @Post('updateSignature') 
    async updateSignature(@Body() body: any){
        return await this.commonService.updateSignature(body)
    }

    @Post('getProlongStage') 
    async getProlongStage(@Body() body: any){
        return await this.commonService.getProlongStage(body)
    }
}