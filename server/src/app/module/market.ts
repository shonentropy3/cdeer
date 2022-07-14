import { Module } from '@nestjs/common';
import { MarketController } from '../controller/market';
import { MarketService } from '../service/market';
import {HttpModule} from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../db/entity/Project';


@Module({
  controllers: [MarketController],
  providers: [MarketService],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Project]),
  ]
})
export class MarketModule {}
