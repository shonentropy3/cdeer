import { Module } from '@nestjs/common';
import { ApplyforController } from '../controller/applyfor';
import { ApplyforService } from '../service/applyfor';
import { ApplyInfo } from '../db/entity/ApplyInfo';	
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  controllers: [ApplyforController],
  providers: [ApplyforService],
  imports: [
    TypeOrmModule.forFeature([ApplyInfo])
  ]
})
export class ApplyforModule {
  
}
