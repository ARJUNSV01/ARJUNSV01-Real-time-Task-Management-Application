import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private consumer: Consumer;
  private readonly logger = new Logger(KafkaConsumerService.name);

  constructor() {
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
        this.logger.log(
          `Received message: ${JSON.stringify({ event, task, id })}`,
        );
        if (event === 'created' || event === 'updated') {
          this.logger.log(`Task ${event}:`, task);
        } else if (event === 'deleted') {
          this.logger.log(`Task deleted with id: ${id}`);
        }
      },
    });
  }
}
