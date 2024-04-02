import * as request from 'supertest';
import app from '../index';

const task = [
    {
        "id": "1",
        "title": "Complete Task Manager App",
        "description": "Finish implementing the Task Manager app with Express and React",
        "completed": false
    }
]


describe('GET /api/tasks', () => {
    it('should return a list of tasks', async () => {
        const response = await request(app).get('/api/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(task);
    });
});

describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
        const newTask = { id: 2, title: 'Task 2', description: 'Description 2', completed: false };
        const response = await request(app).post('/api/tasks').send(newTask);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newTask);
    });
});

describe('PUT /api/tasks/', () => {
    it('should update an existing task', async () => {
        const updatedTask = { title: 'Updated Task', description: 'Updated Description', completed: true };
        const response = await request(app).put(`/api/tasks/1`).send(updatedTask);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(updatedTask);
    });
});

describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
        const tasksResponse = await request(app).get('/api/tasks');

        const response = await request(app).delete(`/api/tasks/1`);
        expect(response.status).toBe(204);

        const updatedTasksResponse = await request(app).get('/api/tasks');
        const deletedTask = updatedTasksResponse.body.find((task: any) => task._id === 1);
        expect(deletedTask).toBeUndefined();
    });
});