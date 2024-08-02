# Use Node.js official image as base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the NestJS application (compile TypeScript to JavaScript)
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application in production mode
CMD ["npm", "run", "start:dev"]
