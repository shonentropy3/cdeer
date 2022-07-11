import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { BlockLog } from '../../entity/BlockLog';
import { Project } from '../../entity/Project';
import { Order } from '../../entity/Order';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [TaskService],
  controllers: [TaskController],
  imports: [
    TypeOrmModule.forFeature([Project,Order,BlockLog])
    
  ]
})
export class TaskModule {}
