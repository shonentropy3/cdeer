import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResolutionService } from '../service/resolution';
import { ApplyforService } from '../service/applyfor';

@Controller('applyFor')
export class ApplyforController {
    constructor(
        private readonly applyforService: ApplyforService,
        private readonly resolutionService: ResolutionService
    ){}

    @Post('applyFor')  // 报名
    async applyFor(@Body() body: any){
        await this.applyforService.apply(body)
    }

    @Post('getApply')  // 展示列表
    async getApply(@Body() body: any){
        return await this.applyforService.getApply(body)
    }

    @Post('cancelApply')  // 取消报名
    async cancelApply(@Body() body: any){
        return await this.applyforService.cancel(body)
        .then(res => {
            // this.resolutionService.TransHashes()
            return res
        })
    }

    @Post('modifyApplySwitch')  //  报名开关
    async modifyApplySwitch(@Body() body: any){
        return await this.applyforService.modifyApplySwitch(body)
    }

    @Post('modifyApplySort')  //  报名开关
    async modifyApplySort(@Body() body: any){
        return await this.applyforService.modifyApplySort(body)
    }
}
