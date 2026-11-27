import { app } from '@azure/functions';
import { taskService } from '../services/task.service.js';
import { handleAuthenticatedHttp } from '../utils/response.util.js';

export const getTasksHandler = handleAuthenticatedHttp(async (request, context, user) => {
    context.log(`[HTTP GET] Processing GetTasks: ${request.url}`);
    const query = Object.fromEntries(request.query.entries());
    return taskService.getTasks({ ...query, organizationId: user.tenantId});
});
app.http('GetTasks', { methods: ['GET'], authLevel: 'anonymous', handler: getTasksHandler });

export const getTaskHandler = handleAuthenticatedHttp(async (request, context, user) => {
    context.log(`[HTTP GET] Processing GetTask: ${request.url}`);
    const id = request.query.get('id') || '';
    return taskService.getTaskById( id, user.tenantId);
});
app.http('GetTask', { methods: ['GET'], authLevel: 'anonymous', handler: getTaskHandler });

export const insertTaskHandler = handleAuthenticatedHttp(async (request, context, user) => {
    context.log(`[HTTP POST] Processing InsertTask: ${request.url}`);
    const body = (await request.json() as Record<string, unknown>);
    return taskService.createTask({ ...body, organizationId: user.tenantId});
}, 201);
app.http('InsertTask', { methods: ['POST'], authLevel: 'anonymous', handler: insertTaskHandler });

export const updateTaskHandler = handleAuthenticatedHttp(async (request, context, user) => {
    context.log(`[HTTP PATCH] Processing UpdateTask: ${request.url}`);
    const id = request.query.get('id') || '';
    const body = await request.json();
    return taskService.updateTask(id, user.tenantId, body);
});
app.http('UpdateTask', { methods: ['PATCH', 'POST'], authLevel: 'anonymous', handler: updateTaskHandler });

export const deleteTaskHandler = handleAuthenticatedHttp(async (request, context, user) => {
    context.log(`[HTTP DELETE] Processing DeleteTask: ${request.url}`);
    const id = request.query.get('id') || '';
    await taskService.deleteTask(id, user.tenantId);
    return { message: 'Task berhasil dihapus.' };
});
app.http('DeleteTask', { methods: ['DELETE'], authLevel: 'anonymous', handler: deleteTaskHandler });

export const bulkDeleteTasksHandler = handleAuthenticatedHttp(async (request, context, user) => {
    context.log(`[HTTP DELETE] Processing BulkDeleteTasks: ${request.url}`);
    const body = await request.json();
    const result = await taskService.bulkDeleteTasks(body, user.tenantId);
    return { message: `Berhasil menghapus ${result.deletedCount} tasks.`, ...result };
});
app.http('BulkDeleteTasks', { methods: ['DELETE'], authLevel: 'anonymous', handler: bulkDeleteTasksHandler });