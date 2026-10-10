import { Task, TaskPriority, TaskStatus } from '../models/task.model.js';

export interface CreateTaskDTO {
    id?: string;
    organizationId: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    tags?: string[];
}

export type UpdateTaskDTO = Partial<Omit<Task, 'id' | 'organizationId'>>;

export interface TaskQueryFilterDTO {
    organizationId: string;
    search?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    page?: number;
    pageSize?: number;
}

export interface PaginatedTasksDTO {
    items: Task[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}