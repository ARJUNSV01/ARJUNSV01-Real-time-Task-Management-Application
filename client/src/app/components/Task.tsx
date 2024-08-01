"use client"
import { Box, Container } from "@mui/material";
import React, { useState } from "react";
import TaskContainer from "./TaskContainer";
import AddTask from "./AddTask";

const Task = () => {
    const[updated,setUpdated]=useState<boolean>(false);
  return (
    <div>
      <Container maxWidth="md">
        <Box my={2}>
          <AddTask setUpdated={setUpdated} />
          <TaskContainer updated={updated} setUpdated={setUpdated}/>
        </Box>
      </Container>
    </div>
  );
};

export default Task;
