import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserService } from '../service/user';


@Controller('user')
export class UserController {
    constructor(private readonly marketService: UserService){}

    @Post('getMyDemand')  //  查看已发布需求
    async getMyDemand(@Body() body: any){
        return await this.marketService.getMyDemand(body)
    }
}