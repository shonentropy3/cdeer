import { Module } from '@nestjs/common';
import { ApplyforController } from '../controller/applyfor';
import { ApplyforService } from '../service/applyfor';
import { ApplyInfo } from '../db/entity/ApplyInfo';	
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../db/entity/Users';
import { ResolutionService } from '../service/resolution';


@Module({
  controllers: [ApplyforController],
  providers: [ApplyforService, ResolutionService],
  imports: [
    TypeOrmModule.forFeature([ApplyInfo, Users,])
  ]
})
export class ApplyforModule {
  
}
