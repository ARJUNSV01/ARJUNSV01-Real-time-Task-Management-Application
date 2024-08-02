import { Controller, Post, Delete, Body, Param, Get } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('tasks')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get(':id')
  async get(@Param('id') id: number): Promise<any> {
    const task = await this.redisService.getTask(id);
    if (!task) {
      return { message: 'Task not found' };
    }
    return task;
  }

  @Post()
  async createOrUpdate(@Body() task: any): Promise<void> {
    await this.redisService.setTask(task.id, task);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.redisService.deleteTask(id);
  }
}