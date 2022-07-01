import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import {HttpModule} from '@nestjs/axios'

@Module({
  controllers: [MarketController],
  providers: [MarketService],
  imports: [HttpModule]
})
export class MarketModule {}
