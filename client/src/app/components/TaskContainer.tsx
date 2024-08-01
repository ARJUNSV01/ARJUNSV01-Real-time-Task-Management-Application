"use client";
import React, { useEffect, useState } from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

interface TaskContainerProps {
    updated: boolean;
  }

const TaskContainer : React.FC<TaskContainerProps> = ({updated}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:4000/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const tasksData: Task[] = await response.json();
        setTasks(tasksData);
      } catch (error) {
        setError("Error fetching tasks");
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [updated]);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} style={{ marginTop: "16px" }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          {statuses.map((status) => (
            <Grid item xs={4} key={status}>
              <Paper style={{ padding: "16px" }}>
                <Typography variant="h6" gutterBottom>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Typography>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ minHeight: "100px" }}
                    >
                      {getTasksByStatus(status).map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                marginBottom: "8px",
                              }}
                            >
                              <Paper elevation={2} style={{ padding: "8px" }}>
                                <Typography variant="subtitle1">
                                  {task.title}
                                </Typography>
                              </Paper>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Paper>
            </Grid>
          ))}
        </DragDropContext>
      </Grid>
    </Container>
  );
};

export default TaskContainer;
