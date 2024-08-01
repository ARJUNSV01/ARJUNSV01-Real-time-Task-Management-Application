import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { KafkaService } from 'src/kafka/kafka.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
    private readonly kafkaService: KafkaService,
    private readonly redisService: RedisService,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskModel.findAll();
  }

  async findOne(id: number): Promise<Task> {
    const cacheKey = `task:${id}`;
    const redisClient = this.redisService.getClient();
    const cachedTask = await redisClient.get(cacheKey);
    if (cachedTask) {
      console.log('Cache hit');
      return JSON.parse(cachedTask);
    }
    const task = await this.taskModel.findByPk(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.taskModel.create(createTaskDto);
    await this.kafkaService.sendMessage('task-events', [
      { value: JSON.stringify({ event: 'created', task }) },
    ]);
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.taskModel.findByPk(id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      await task.update(updateTaskDto);
      await this.kafkaService.sendMessage('task-events', [
        { value: JSON.stringify({ event: 'updated', task }) },
      ]);
      return task;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const task = await this.taskModel.findByPk(id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      await task.destroy();
      await this.kafkaService.sendMessage('task-events', [
        { value: JSON.stringify({ event: 'deleted', id }) },
      ]);
    } catch (error) {
      throw error;
    }
  }
}
