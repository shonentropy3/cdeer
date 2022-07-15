import { Body, Controller, Post } from '@nestjs/common';
import { ApplyforService } from '../service/applyfor';

@Controller('applyfor')
export class ApplyforController {
    constructor(private readonly applyforService: ApplyforService){}

    @Post('createApply')  // 发布需求
    async createProject(@Body() body: any){
        return await this.applyforService.apply(body)



            @Post('applyFor')  // 报名
            async applyFor(@Body() body: any){
                return await this.applyforService.getMyDemand(body)
            }
        
            @Post('cancelApply')  // 取消报名
            async cancelApply(@Body() body: any){
                return await this.applyforService.getMyDemand(body)
            }
            @Post('modifyApplySwitch')  //  报名开关
            async modifyApplySwitch(@Body() body: any){
                return await this.applyforService.getMyDemand(body)
            

    }
}
