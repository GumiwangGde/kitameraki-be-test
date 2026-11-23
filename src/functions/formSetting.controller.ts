import { app } from '@azure/functions';
import { formSettingService } from '../services/formSetting.service.js';
import { handleHttp } from '../utils/response.util.js';

export const getFormSettingsHandler = handleHttp(async (request, context) => {
    context.log(`[HTTP GET] Processing GetFormSettings: ${request.url}`);
    const organizationId = request.query.get('organizationId') || '';
    return formSettingService.getSettings(organizationId);
});
app.http('GetFormSettings', { methods: ['GET'], authLevel: 'anonymous', handler: getFormSettingsHandler });

export const saveFormSettingsHandler = handleHttp(async (request, context) => {
    context.log(`[HTTP POST] Processing SaveFormSettings: ${request.url}`);
    const body = await request.json();
    return formSettingService.saveSettings(body);
})
app.http('SaveFormSettings', { methods: ['POST'], authLevel: 'anonymous', handler: saveFormSettingsHandler });