import { Body, Controller, Post } from '@nestjs/common';
import { ApplyforService } from '../service/applyfor';

@Controller('applyfor')
export class ApplyforController {
    constructor(private readonly applyforService: ApplyforService){}

    @Post('createApply')  // 发布需求
    async createProject(@Body() body: any){
        return await this.applyforService.apply(body)
    }
}
