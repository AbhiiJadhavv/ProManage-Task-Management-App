import express from 'express';
import { createTask, getTasksByUser, updateTaskStatus, updateTask, deleteTask, addUserToTasks, toggleChecklistItemCompletion, getTaskByIdReadOnly } from '../controllers/task.controller.js';
import isAuthenticated from "../auth/isAuthenticated.js";

const router = express.Router();

router.post('/', isAuthenticated, createTask);

router.get('/user', isAuthenticated, getTasksByUser);

router.put('/addUser', isAuthenticated, addUserToTasks);

router.put('/:taskId/status', isAuthenticated, updateTaskStatus);

router.put('/:taskId', isAuthenticated, updateTask);

router.delete('/:taskId', isAuthenticated, deleteTask);

router.put('/:taskId/checklist/toggle', isAuthenticated, toggleChecklistItemCompletion);

router.get('/shared/:taskId', getTaskByIdReadOnly);

export default router;
