import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TaskService {
  private readonly redisUrl = `${process.env.REDIS_URL}/tasks`;
  constructor(
    @InjectModel(Task) private taskModel: typeof Task,
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
    private readonly httpService: HttpService,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskModel.findAll();
  }

  async findOne(id: number): Promise<Task> {
    try {
      try {
        const cachedTask = await this.httpService
          .get(`${this.redisUrl}/${id}`)
          .toPromise();
        if (cachedTask.data) {
          console.log('cache hit', cachedTask.data);
          return cachedTask.data;
        }
      } catch (error) {
        console.log(error, 'Redis service error');
      }

      const task = await this.taskModel.findByPk(id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return task;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = await this.taskModel.create(createTaskDto);
      console.log('going to emitting event');
      this.kafkaService.emit('task-events', {
        event: 'created',
        task,
      });

      return task;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.taskModel.findByPk(id);
      await task.update(updateTaskDto);
      this.kafkaService.emit('task-events', {
        event: 'updated',
        task,
      });

      return task;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number): Promise<string> {
    try {
      const task = await this.taskModel.findByPk(id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      await task.destroy();
      this.kafkaService.emit('task-events', {
        event: 'deleted',
        id,
      });
      return "Deleted"
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
