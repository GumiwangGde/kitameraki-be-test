import { getTaskContainer } from '../config/cosmos.js';
import { FormSetting } from '../models/formSetting.model.js';
import { ignoreNotFound } from '../utils/cosmos.util.js';

export class FormSettingRepository {
    private readonly docId = 'form-settings';

    async findByOrganizationId(organizationId: string): Promise<FormSetting | null> {
        const container = getTaskContainer();
        const result = await ignoreNotFound(
            container.item(this.docId, organizationId).read<FormSetting>()
        );
        return result?.resource || null;
    }

    async upsert(formSetting: FormSetting): Promise<FormSetting> {
        const container = getTaskContainer();
        const { resource } = await container.items.upsert<FormSetting>(formSetting);
        return resource as FormSetting;
    }
}

export const formSettingRepository = new FormSettingRepository();