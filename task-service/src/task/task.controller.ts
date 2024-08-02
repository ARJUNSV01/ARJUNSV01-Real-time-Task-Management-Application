import { Controller, Get, Post, Put, Delete, Param, Body, Inject } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.model';
import { ClientKafka } from '@nestjs/microservices';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
  ) {}

  @Get()
  async findAll(): Promise<Task[]> {
    console.log('getting')
    return this.taskService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.taskService.create(createTaskDto);
    this.kafkaService.emit('task-events', { event: 'created', task });
    return task;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskService.update(id, updateTaskDto);
    this.kafkaService.emit('task-events', { event: 'updated', task });
    return task;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.taskService.remove(id);
    this.kafkaService.emit('task-events', { event: 'deleted', id });
    
  }
}
