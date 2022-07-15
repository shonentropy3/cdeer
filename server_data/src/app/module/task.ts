import { Module } from '@nestjs/common';
import { TaskController } from '../controller/task';
import { TaskService } from '../service/task';
import { Project } from 'src/app/db/entity/Project';
import { BlockLog } from 'src/app/db/entity/BlockLog';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [
    TypeOrmModule.forFeature([Project,BlockLog])
  ]
})
export class TaskModule {}
