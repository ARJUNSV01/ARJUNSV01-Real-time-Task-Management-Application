"use client";
import React, { useState } from "react";
import { Grid, Button, TextField } from "@mui/material";
import { Socket } from "socket.io-client";

interface AddTaskProps {
  socket: Socket;
}

const AddTask: React.FC<AddTaskProps> = ({ socket }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const handleAddClick = async () => {
    if (newTaskTitle.trim() && newTaskDescription.trim()) {
      try {
        const response = await fetch("http://localhost:3000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTaskTitle.trim(),
            description: newTaskDescription.trim(),
          }),
        });

        if (response.ok) {
          const addedTask = await response.json();
          console.log("Task added:", addedTask);
          socket.emit('createTask');
          setNewTaskTitle("");
          setNewTaskDescription("");
        } else {
          console.error("Failed to add task");
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6}>
        <TextField
          label="Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Task Description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddClick}
          fullWidth
        >
          Add Task
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddTask;
