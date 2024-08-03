import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('tasks')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get(':id')
  async get(@Param('id') id: number): Promise<any> {
    try {
      const task = await this.redisService.getTask(id);
      if (!task) {
        return { message: 'Task not found' };
      }
      return task;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post()
  async createOrUpdate(@Body() task: any): Promise<void> {
    try {
      await this.redisService.setTask(task.id, task);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.redisService.deleteTask(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
