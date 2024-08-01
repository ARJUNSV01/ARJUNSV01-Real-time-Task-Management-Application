import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskModule } from './task/task.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345678',
      database: 'Task_Management',
      autoLoadModels: true,
      synchronize: true,
    }),
    TaskModule,
    KafkaModule,
  ],
})
export class AppModule {}
