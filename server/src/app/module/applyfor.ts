import { Module } from '@nestjs/common';
import { ApplyforController } from '../controller/applyfor';
import { ApplyforService } from '../service/applyfor';

@Module({
  controllers: [ApplyforController],
  providers: [ApplyforService]
})
export class ApplyforModule {
  
}
