import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import {HttpModule} from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entity/Order';

@Module({
  controllers: [MarketController],
  providers: [MarketService],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Order])
  ]
})
export class MarketModule {}
