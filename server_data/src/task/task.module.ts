import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Project } from 'src/entity/Project';
import { BlockLog } from 'src/entity/BlockLog';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [
    TypeOrmModule.forFeature([Project,BlockLog])
  ]
})
export class TaskModule {}
