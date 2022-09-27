import { Module } from '@nestjs/common';
import {HttpModule} from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '../controller/order';
import { OrderService } from '../service/order';
import { Orders } from '../db/entity/Orders';

@Module({
    controllers: [OrderController],
    providers: [OrderService],
    imports: [
      HttpModule,
      TypeOrmModule.forFeature([Orders]),
    ]
})
export class OrderModule {}
