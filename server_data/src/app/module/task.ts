import { Module } from '@nestjs/common';
import { TaskController } from '../controller/task';
import { TaskService } from '../service/task';
import { Demand } from 'src/app/db/entity/Demand';
import { BlockLog } from 'src/app/db/entity/BlockLog';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplyInfo } from '../db/entity/ApplyInfo';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [
    TypeOrmModule.forFeature([Demand,BlockLog,ApplyInfo])
  ]
})
export class TaskModule {}
