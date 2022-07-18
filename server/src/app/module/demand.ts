import { Module } from '@nestjs/common';
import { MarketController } from '../controller/demand';
import { CommonController } from '../controller/common';
import { UserController } from '../controller/user';
import { MarketService } from '../service/demand';
import { CommonService } from '../service/common';
import { UserService } from '../service/user';
import {HttpModule} from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Demand } from '../db/entity/Demand';


@Module({
  controllers: [MarketController, CommonController, UserController],
  providers: [MarketService, CommonService, UserService],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Demand]),
  ]
})
export class DemandModule {}
