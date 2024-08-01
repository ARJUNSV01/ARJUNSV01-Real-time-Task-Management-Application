enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
  }
  
  export class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
  }
  