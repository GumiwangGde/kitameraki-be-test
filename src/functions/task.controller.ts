import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { taskService } from '../services/task.service.js';
import { formSettingService } from '../services/formSetting.service.js';
import { successResponse, errorResponse } from '../utils/response.util.js';

export async function getTasksHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`[HTTP GET] Processing GetTasks: ${request.url}`);
    try {
        const query = Object.fromEntries(request.query.entries());
        const result = await taskService.getTasks(query);
        return successResponse(result, 200);
    } catch (error) {
        return errorResponse(error, context);
    }
}

app.http('GetTasks', { methods: ['GET'], authLevel: 'anonymous', handler: getTasksHandler });

export async function getTaskHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`[HTTP GET] Processing GetTask: ${request.url}`);
    try {
        const id = request.query.get('id') || '';
        const organizationId = request.query.get('organizationId') || '';
        const task = await taskService.getTaskById(id, organizationId);
        return successResponse(task, 200);
    } catch (error) {
        return errorResponse(error, context);
    }
}

app.http('GetTask', { methods: ['GET'], authLevel: 'anonymous', handler: getTaskHandler });

export async function insertTaskHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`[HTTP POST] Processing InsertTask: ${request.url}`);
    try {
        const body = await request.json();
        const createdTask = await taskService.createTask(body);
        return successResponse(createdTask, 201);
    } catch (error) {
        return errorResponse(error, context);
    }
}

app.http('InsertTask', { methods: ['POST'], authLevel: 'anonymous', handler: insertTaskHandler });

export async function updateTaskHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`[HTTP PATCH] Processing UpdateTask: ${request.url}`);
    try {
        const id = request.query.get('id') || '';
        const organizationId = request.query.get('organizationId') || '';
        const body = await request.json();
        const updatedTask = await taskService.updateTask(id, organizationId, body);
        return successResponse(updatedTask, 200);
    } catch (error) {
        return errorResponse(error, context);
    }
}

app.http('UpdateTask', { methods: ['PATCH', 'POST'], authLevel: 'anonymous', handler: updateTaskHandler });

export async function deleteTaskHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`[HTTP DELETE] Processing DeleteTask: ${request.url}`);
    try {
        const id = request.query.get('id') || '';
        const organizationId = request.query.get('organizationId') || '';
        await taskService.deleteTask(id, organizationId);
        return successResponse({ message: 'Task berhasil dihapus.' }, 200);
    } catch (error) {
        return errorResponse(error, context);
    }
}

app.http('DeleteTask', { methods: ['DELETE'], authLevel: 'anonymous', handler: deleteTaskHandler });

export async function bulkDeleteTasksHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`[HTTP DELETE] Processing BulkDeleteTasks: ${request.url}`);
    try {
        const organizationId = request.query.get('organizationId') || '';
        const body = await request.json();

        const result = await taskService.bulkDeleteTasks(body, organizationId);
        return successResponse(
            { message: `Berhasil menghapus ${result.deletedCount} tasks.`, ...result },
            200
        );
    } catch (error) {
        return errorResponse(error, context);
    }
}

app.http('BulkDeleteTasks', { methods: ['DELETE'], authLevel: 'anonymous', handler: bulkDeleteTasksHandler });

export async function getFormSettingsHandler(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`[HTTP GET] Processing GetFormSettings: ${request.url}`);
    try {
        const organizationId = request.query.get('organizationId') || '';
        const result = await formSettingService.getSettings(organizationId);
        return successResponse(result, 200);
    } catch (error) {
        return errorResponse(error, context);
    }
}

app.http('GetFormSettings', { methods: ['GET'], authLevel: 'anonymous', handler: getFormSettingsHandler });

export async function saveFormSettingsHandler(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`[HTTP POST] Processing SaveFormSettings: ${request.url}`);
    try {
        const body = await request.json();
        const result = await formSettingService.saveSettings(body);
        return successResponse(result, 200);
    } catch (error) {
        return errorResponse(error, context);
    }
}

app.http('SaveFormSettings', { methods: ['POST'], authLevel: 'anonymous', handler: saveFormSettingsHandler });