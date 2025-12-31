
import { Task, TaskStatus, Priority } from '../types';

const STORAGE_KEY = 'leilatask_local_db';

export const taskService = {
  getAllTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse tasks', e);
      return [];
    }
  },

  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  createTask: (title: string, description: string, dueDate: string, priority: Priority): Task => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      dueDate,
      priority,
      status: TaskStatus.PENDING,
      createdAt: Date.now(),
    };
    return newTask;
  },

  updateTask: (tasks: Task[], updatedTask: Task): Task[] => {
    return tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
  },

  deleteTask: (tasks: Task[], id: string): Task[] => {
    return tasks.filter(t => t.id !== id);
  },

  toggleStatus: (tasks: Task[], id: string): Task[] => {
    return tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === TaskStatus.PENDING ? TaskStatus.COMPLETED : TaskStatus.PENDING
        };
      }
      return t;
    });
  }
};
