"use client";
import React, { useState } from "react";
import { Grid, Button, TextField } from "@mui/material";

interface AddTaskProps {
 setUpdated: (updater: (prev: boolean) => boolean) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ setUpdated }) => {
  const [newTask, setNewTask] = useState("");

  const handleAddClick = async () => {
    if (newTask.trim()) {
      try {
        const response = await fetch("http://localhost:4000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTask.trim() }),
        });

        if (response.ok) {
          const addedTask = await response.json();
          console.log("Task added:", addedTask);
          setUpdated((prev: boolean) => !prev);
          setNewTask("");
        } else {
          console.error("Failed to add task");
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
      setNewTask("");
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={8}>
        <TextField
          label="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
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
