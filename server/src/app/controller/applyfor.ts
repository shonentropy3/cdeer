import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserService } from '../service/user';


@Controller('applyFor')
export class UserController {
    constructor(private readonly marketService: UserService){}

    @Post('applyFor')  // 报名
    async applyFor(@Body() body: any){
        return await this.marketService.getMyDemand(body)
    }

    @Post('cancelApply')  // 取消报名
    async cancelApply(@Body() body: any){
        return await this.marketService.getMyDemand(body)
    }
    @Post('modifyApplySwitch')  //  报名开关
    async modifyApplySwitch(@Body() body: any){
        return await this.marketService.getMyDemand(body)
    }
}