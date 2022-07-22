import { Module } from '@nestjs/common';
import { TaskController } from '../controller/task';
import { TaskService } from '../service/task';
import { Tasks } from 'src/app/db/entity/Tasks';
import { BlockLog } from 'src/app/db/entity/BlockLog';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplyInfo } from '../db/entity/ApplyInfo';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [
    TypeOrmModule.forFeature([Tasks,BlockLog,ApplyInfo])
  ]
})
export class TaskModule {}
