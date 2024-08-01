import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.model';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [SequelizeModule.forFeature([Task]), KafkaModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
