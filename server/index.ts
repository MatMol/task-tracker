import { Express, Request, Response } from "express";
import express = require('express')
import bodyParser = require("body-parser");
import cors = require("cors");
import fs = require("fs");

import { Task } from './data/tasks.interface';

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Methods
const readTasksFromFile = (): Task[] => {
  try {
      const data = fs.readFileSync('./data/tasks.json', 'utf8');
      if (data.trim() === '') {
          return [];
      }
      return JSON.parse(data);
  } catch (err) {
      console.error('Error reading file:', err);
      return [];
  }
};

const writeTasksToFile = (tasks: Task[]): void => {
  try {
      fs.writeFileSync('./data/tasks.json', JSON.stringify(tasks, null, 2), 'utf8');
  } catch (err) {
      console.error('Error writing file:', err);
  }
};

// Initialize tasks array by reading from the JSON file
let tasks: Task[] = readTasksFromFile();

// Server start
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

// Endpoints
app.get('/api/tasks', (req: Request, res: Response) => {
  res.json(tasks)
})

app.post('/api/tasks', (req: Request, res: Response) => {
  const newTask: Task = req.body;
  tasks.push(newTask)
  writeTasksToFile(tasks)
  res.status(201).json(newTask)
})

app.put('/api/tasks/:id', (req: Request, res: Response) => {
  const taskId: string = req.params.id;
  const updatedTask: Task = req.body;
  tasks = tasks.map(task => (task.id === taskId ? updatedTask : task));
  writeTasksToFile(tasks);
  res.json(updatedTask);
})

app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  const taskId: string = req.params.id;
  tasks = tasks.filter(task => task.id !== taskId);
  writeTasksToFile(tasks);
  res.sendStatus(204);
})

export default app;