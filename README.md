# Real-time-Task-Management-Application
This a full-stack real-time task management application using microservice architecture and containerized using docker.

## Tech Stack

- **Frontend**:
  - Next.js
  - MUI (Material-UI)
  - socket.io-client
  
- **Backend**:
  - NestJS
  - Microservices:
    - Task Service
    - Kafka Service
    - Redis Service
  
- **Database**: PostgreSQL
- **Asynchronous Communication**: Kafka
- **Caching**: Redis
- **Containerization**: Docker


## Setup and Installation

To set up and run the application, follow these steps:

1. **Install dependencies for the client:**

   Navigate to the `client` folder and run:

   ```bash
   cd client
   npm install

2. **Install dependencies for the Kafka service:**

   Navigate to the kafka-service folder and run:

   ```bash
   cd ../kafka-service
   npm install


3. **Install dependencies for the Redis service::**

   Navigate to the redis-service folder and run:

   ```bash
    cd ../redis-service
    npm install

4. **Install dependencies for the Task service:**

   Navigate to the task-service folder and run:

   ```bash
    cd ../task-service
    npm install


5. **Build Docker images::**

   Go to the root folder of the project and run:

   ```bash
    cd ..
    docker-compose build

6. **Start the application::**

   Run the following command to start the Docker containers:

   ```bash
    docker-compose up

## Usage

Once the containers are running, access the application via http://localhost:5000


