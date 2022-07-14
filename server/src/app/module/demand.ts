import { Module } from '@nestjs/common';
import { MarketController } from '../controller/demand';
import { CommonController } from '../controller/common';
import { UserController } from '../controller/user';
import { MarketService } from '../service/demand';
import { CommonService } from '../service/common';
import { UserService } from '../service/user';
import {HttpModule} from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../db/entity/Project';


@Module({
  controllers: [MarketController, CommonController, UserController],
  providers: [MarketService, CommonService, UserService],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Project]),
  ]
})
export class DemandModule {}
