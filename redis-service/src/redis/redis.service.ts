import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async getTask(id: number): Promise<any> {
    const task = await this.redis.get(`task:${id}`);
    return task ? JSON.parse(task) : null;
  }

  async setTask(id: number, task: any): Promise<void> {
    await this.redis.set(`task:${id}`, JSON.stringify(task));
  }

  async deleteTask(id: number): Promise<void> {
    await this.redis.del(`task:${id}`);
  }
}