import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.model';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TaskGateway } from './task.gateway';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [SequelizeModule.forFeature([Task]), KafkaModule,RedisModule],
  controllers: [TaskController],
  providers: [TaskService, TaskGateway],
})
export class TaskModule {}
