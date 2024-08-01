import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { RedisService } from '../redis/redis.service'; // Import RedisService

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private consumer: Consumer;

  constructor(private readonly redisService: RedisService) {
    const kafka = new Kafka({
      brokers: ['localhost:9092'],
    });

    this.consumer = kafka.consumer({ groupId: 'task-consumer-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'task-events' });

    this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const { event, task, id } = JSON.parse(message.value.toString());

        const redisClient = this.redisService.getClient();

        if (event === 'created' || event === 'updated') {
          await redisClient.set(`task:${task.id}`, JSON.stringify(task));
        } else if (event === 'deleted') {
          await redisClient.del(`task:${id}`);
        }
      },
    });
  }
}
