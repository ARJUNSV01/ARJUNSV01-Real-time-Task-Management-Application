"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Paper, Typography, Button } from "@mui/material";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  description: string;
}

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

const TaskDetailPage: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      if (typeof id !== "string") return;
      try {
        const response = await fetch(`http://localhost:3000/tasks/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }
        const taskData: Task = await response.json();
        setTask(taskData);
      } catch (error) {
        setError("Error fetching task details");
      }
    };

    fetchTask();
  }, [id]);

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
    <Container maxWidth="md" style={{ marginTop: "16px" }}>
      <Paper style={{ padding: "16px" }}>
        <Typography variant="h4" gutterBottom>
          Task Details
        </Typography>
        {task && (
          <>
            <Typography variant="h6" gutterBottom>
              <strong>Title:</strong> {task.title}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <strong>Status:</strong> {task.status}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <strong>Description:</strong> {task.description}
            </Typography>
            <Link href={`/`}>
              <Button variant="contained" color="primary">
                Back
              </Button>
            </Link>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default TaskDetailPage;
