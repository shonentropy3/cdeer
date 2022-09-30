import { Module } from '@nestjs/common';
import { MarketController } from '../controller/demand';
import { CommonController } from '../controller/common';
import { UserController } from '../controller/user';
import { MarketService } from '../service/demand';
import { CommonService } from '../service/common';
import { UserService } from '../service/user';
import {HttpModule} from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from '../db/entity/Tasks';
import { Nfts } from '../db/entity/Nfts';
import { ApplyInfo } from '../db/entity/ApplyInfo';
import { Users } from '../db/entity/Users';
import { ResolutionService } from '../service/resolution';


@Module({
  controllers: [MarketController, CommonController, UserController],
  providers: [MarketService, CommonService, UserService, ResolutionService],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Tasks, Nfts, ApplyInfo, Users]),
  ]
})
export class DemandModule {}
