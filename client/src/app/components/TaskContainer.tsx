"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Link from "next/link";
import { Socket } from "socket.io-client";
import { deleteTask, getTasks, updateTaskStatus } from "../api/task";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  description: string;
}

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

interface TaskContainerProps {
  socket: Socket;
}

const TaskContainer: React.FC<TaskContainerProps> = ({ socket }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        setError("Error fetching tasks");
        console.log(error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    socket.on("tasks", (data) => {
      setTasks(data);
    });
  }, [socket]);

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
      const updatedTask = await updateTaskStatus(draggableId, destination.droppableId);
      socket.emit("updateTask");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      socket.emit("deleteTask");
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
                                <Box>
                                  <Typography variant="subtitle1">
                                    {task.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    {task.description}{" "}
                                  </Typography>
                                </Box>
                                <Box>
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
                                </Box>
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
