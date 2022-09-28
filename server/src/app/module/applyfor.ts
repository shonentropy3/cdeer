import { Module } from '@nestjs/common';
import { ApplyforController } from '../controller/applyfor';
import { ApplyforService } from '../service/applyfor';
import { ApplyInfo } from '../db/entity/ApplyInfo';	
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../db/entity/Users';


@Module({
  controllers: [ApplyforController],
  providers: [ApplyforService],
  imports: [
    TypeOrmModule.forFeature([ApplyInfo, Users])
  ]
})
export class ApplyforModule {
  
}
