import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import {HttpModule} from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../entity/Project';


@Module({
  controllers: [MarketController],
  providers: [MarketService],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Project]),
  ]
})
export class MarketModule {}
