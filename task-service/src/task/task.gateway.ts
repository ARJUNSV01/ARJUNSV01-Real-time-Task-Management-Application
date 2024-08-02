import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { TaskService } from './task.service';


@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})
export class TaskGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly taskService: TaskService) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log('a user connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('a user disconnected', client.id);
  }

  @SubscribeMessage('createTask')
  async handleCreateTask(@MessageBody() data: string) {
    console.log('create emitted');
    const tasks = await this.taskService.findAll();
    this.server.emit('tasks', tasks);
  }

  @SubscribeMessage('updateTask')
  async handleTaskDragged(
    @MessageBody() data: string) {
    console.log('update emitted');
    const tasks = await this.taskService.findAll();
    this.server.emit('tasks', tasks);
  }

  @SubscribeMessage('deleteTask')
  async handleDeleteTask(@MessageBody() data: string) {
    console.log('delete emitted');
    const tasks = await this.taskService.findAll();
    this.server.emit('tasks', tasks);
  }
}
