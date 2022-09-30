import { Module } from '@nestjs/common';
import {HttpModule} from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '../controller/order';
import { OrderService } from '../service/order';
import { Orders } from '../db/entity/Orders';
import { ResolutionService } from '../service/resolution';
import { ApplyInfo } from '../db/entity/ApplyInfo';


@Module({
  controllers: [OrderController],
  providers: [OrderService, ResolutionService],
  imports: [
    TypeOrmModule.forFeature([Orders, ApplyInfo])
  ]
})
export class OrderModule {
  
}
