import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.model';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { TaskGateway } from './task.gateway';

@Module({
  imports: [
    SequelizeModule.forFeature([Task]),
    HttpModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: 'task-consumer-group',
          },
        },
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskGateway],
})
export class TaskModule {}