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

    @Post('getApply')
    async getApply(@Body() body: any){
        return await new Promise ((resolve,reject)=>{
            resolve(this.userService.getApply(body))
         })
         .then((res)=>{
            return this.userService.getApplyList(res)
         })
    }

    @Post('getMyApplylist')
    async getMyApplylist(@Body() body: any){
        return await this.userService.getMyApplylist(body)
    }
    
    @Post('getMyNftlist')
    async getMyNftlist(@Body() body: any){
        let flag: any;
        await this.userService.hasNft(body)
        .then(res => {
            flag = res
        })
        flag ? 
        // psql有
            await this.userService.isOutTime(body)
                .then(async(res) => {
                    res ? 
                        // 没有超时 ==> 获取psql缓存
                        ''
                    :
                        // 超时了 ==> 更新psql
                        await this.userService.getNftscan(body)
                            .then(res => {
                                this.userService.updateNftCache(res);
                            })
                })
        :
        // psql没有
            await this.userService.getNftscan(body)
                .then(res => {
                    this.userService.setNftCache(res);
                })


        return this.userService.getCacheNftsList(body)
        
        
    }
}