import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskModel.findAll();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskModel.findByPk(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.taskModel.create(createTaskDto);
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.findOne(id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      await task.update(updateTaskDto);
      return task;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const task = await this.findOne(id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      await task.destroy();
    } catch (error) {
      throw error;
    }
  }
}
