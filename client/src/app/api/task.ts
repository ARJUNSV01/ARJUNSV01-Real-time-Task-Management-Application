const TASK_SERVICE_URL = process.env.NEXT_PUBLIC_TASK_SERVICE_URL

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export async function createTask(
  newTaskTitle: string,
  newTaskDescription: string
): Promise<Task> {
  try {
    const response = await fetch(`${TASK_SERVICE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
      }),
    });

    return response.json();
  } catch (error) {
    throw new Error(`Error creating task`);
  }
}

export async function getTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${TASK_SERVICE_URL}/tasks`);
    return response.json();
  } catch (error) {
    throw new Error(`Error fetching tasks`);
  }
}

export async function getTaskById(id: string): Promise<Task> {
  try {
    const response = await fetch(`${TASK_SERVICE_URL}/tasks/${id}`);
    return response.json();
  } catch (error) {
    throw new Error(`Error fetching task`);
  }
}

export async function updateTaskStatus(
  id: string,
  status: string
): Promise<Task> {
  try {
    const response = await fetch(`${TASK_SERVICE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  } catch (error) {
    throw new Error(`Error updating task status`);
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    const response = await fetch(`${TASK_SERVICE_URL}/tasks/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(`Error deleting task`);
  }
}
