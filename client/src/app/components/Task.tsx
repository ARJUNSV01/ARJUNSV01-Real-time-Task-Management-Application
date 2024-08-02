"use client"
import { Box, Container } from "@mui/material";
import React from "react";
import TaskContainer from "./TaskContainer";
import AddTask from "./AddTask";
import {io, Socket } from "socket.io-client"; 

const socket: Socket = io("http://localhost:3000");

console.log(socket)

const Task = () => {
  return (
    <div>
      <Container maxWidth="md">
        <Box my={2}>
          <AddTask socket={socket} />
          <TaskContainer socket={socket}/>
        </Box>
      </Container>
    </div>
  );
};

export default Task;
