import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';  // Import TaskModule


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
    }),
    
    TaskModule, 
  ],
})
export class AppModule {}
