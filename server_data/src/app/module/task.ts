import { Module } from '@nestjs/common';
import { TaskController } from '../controller/task';
import { TaskService } from '../service/task';
import { Demand } from 'src/app/db/entity/Demand';
import { BlockLog } from 'src/app/db/entity/BlockLog';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [
    TypeOrmModule.forFeature([Demand,BlockLog])
  ]
})
export class TaskModule {}
