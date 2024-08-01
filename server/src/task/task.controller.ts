import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
  } from '@nestjs/common';
  import { TaskService } from './task.service';
  import { CreateTaskDto } from './dto/create-task.dto';
  import { UpdateTaskDto } from './dto/update-task.dto';
  import { Task } from './task.model';
  @Controller('tasks')
  export class TaskController {
    constructor(private readonly taskService: TaskService) {}
    @Get()
    async findAll(): Promise<Task[]> {
      return this.taskService.findAll();
    }
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Task> {
      return this.taskService.findOne(id);
    }
    @Post()
    async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
      return this.taskService.create(createTaskDto);
    }
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() updateTaskDto: UpdateTaskDto,
    ): Promise<Task> {
      return this.taskService.update(id, updateTaskDto);
    }
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
      return this.taskService.remove(id);
    }
  }
  