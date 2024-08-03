import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private consumer: Consumer;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const kafka = new Kafka({
      clientId: 'kafka-service',
      brokers: [process.env.KAFKA_BROKER],
    });

    this.consumer = kafka.consumer({ groupId: 'kafka-service-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'task-events' });

    this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const { event, task, id } = JSON.parse(message.value.toString());
        console.log('receiving event',task)
        try {
          if (event === 'created' || event === 'updated') {
             await this.httpService.post(`${this.configService.get('REDIS_URL')}/tasks`, task).toPromise()
          } else if (event === 'deleted') {
            await this.httpService.delete(`${this.configService.get('REDIS_URL')}/tasks/${id}`).toPromise();
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      },
    });
  }
}
