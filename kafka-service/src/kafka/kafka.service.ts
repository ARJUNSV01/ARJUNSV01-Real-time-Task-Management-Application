import { Injectable } from '@nestjs/common';
import { Kafka, Producer, Message } from 'kafkajs';

@Injectable()
export class KafkaService {
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'kafka-service',
      brokers: ['localhost:9092'],
    });

    this.producer = kafka.producer();

    this.producer.connect()
      .then(() => {
        console.log('Kafka Producer connected.');
      })
      .catch((error) => {
        console.error('Kafka Producer connection error:', error);
      });
  }

  async sendMessage(topic: string, messages: Message[]) {
    try {
      await this.producer.send({
        topic,
        messages,
      });
      console.log(`Messages sent`);
    } catch (error) {
      console.error('Error sending message', error);
    }
  }
}

