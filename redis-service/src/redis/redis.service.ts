import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
  }

  async getTask(id: number): Promise<any> {
    try {
      const task = await this.redis.get(`task:${id}`);
      return task ? JSON.parse(task) : null;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async setTask(id: number, task: any): Promise<void> {
    try {
      await this.redis.set(`task:${id}`, JSON.stringify(task));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteTask(id: number): Promise<void> {
    try {
      await this.redis.del(`task:${id}`);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
