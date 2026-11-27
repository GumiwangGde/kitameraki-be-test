import { app } from '@azure/functions';
import { formSettingService } from '../services/formSetting.service.js';
import { handleAuthenticatedHttp } from '../utils/response.util.js';

export const getFormSettingsHandler = handleAuthenticatedHttp(async (request, context, user) => {
    context.log(`[HTTP GET] Processing GetFormSettings: ${request.url}`);
    return formSettingService.getSettings(user.tenantId);
});
app.http('GetFormSettings', { methods: ['GET'], authLevel: 'anonymous', handler: getFormSettingsHandler });

export const saveFormSettingsHandler = handleAuthenticatedHttp(async (request, context, user) => {
    context.log(`[HTTP POST] Processing SaveFormSettings: ${request.url}`);
    const body = (await request.json() as Record<string, unknown>);
    return formSettingService.saveSettings({ ...body, organizationId: user.tenantId});
})
app.http('SaveFormSettings', { methods: ['POST'], authLevel: 'anonymous', handler: saveFormSettingsHandler });