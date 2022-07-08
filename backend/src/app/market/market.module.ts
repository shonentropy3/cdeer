import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import {HttpModule} from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entity/Order';
import { Project } from '../../entity/Project';

@Module({
  controllers: [MarketController],
  providers: [MarketService],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Order,Project])

  ]
})
export class MarketModule {}
