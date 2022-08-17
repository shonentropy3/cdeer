import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserService } from '../service/user';


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post('getMyDemand')  //  查看已发布需求
    async getMyDemand(@Body() body: any){
        return await this.userService.getMyDemand(body)
    }

    @Post('getMyApplylist')
    async getMyApplylist(@Body() body: any){
        return await this.userService.getMyApplylist(body)
    }
    
    @Post('getMyNftlist')
    async getMyNftlist(@Body() body: any){


        // return this.userService.getNftscanErc1155(body)
        
        let arr = []
        return await new Promise ((resolve,reject)=>{
            // 存入psql
            resolve(this.userService.getNft(body))
         })
         .then((res)=>{
            // return this.commonService.pushFile(files, res)
            console.log('==>',res);
            
         })
    }
}