"use client";
import React, { useEffect, useState } from "react";
import { Container, Grid, IconButton, Paper, Typography } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

interface TaskContainerProps {
  updated: boolean;
  setUpdated: (updater: (prev: boolean) => boolean) => void;
}

const TaskContainer: React.FC<TaskContainerProps> = ({
  updated,
  setUpdated,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:4000/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const tasksData: Task[] = await response.json();
        setTasks(tasksData);
      } catch (error) {
        setError("Error fetching tasks");
        console.log(error);
      }
    };

    fetchTasks();
  }, [updated]);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragEnd = async (result: DropResult) => {
    console.log("drag event");
    const { destination, source, draggableId } = result;

    console.log(destination, "destination");

    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    try {
      const response = await fetch(
        `http://localhost:4000/tasks/${draggableId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: destination.droppableId }),
        }
      );

      setUpdated((prev) => !prev);

      if (!response.ok) {
        throw new Error("Failed to update task");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      setUpdated((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return (
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "16px" }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

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
                          draggableId={task.id.toString()}
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
                              <Paper
                                elevation={2}
                                style={{
                                  padding: "8px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography variant="subtitle1">
                                  {task.title}
                                </Typography>
                                <IconButton
                                  onClick={() => handleDeleteTask(task.id)}
                                  color="secondary"
                                >
                                  <DeleteIcon />
                                </IconButton>
                                <Link href={`/${task.id}`}>
                                  <IconButton>
                                    <VisibilityIcon />
                                  </IconButton>
                                </Link>
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
