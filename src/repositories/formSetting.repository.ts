import { getFormSettingsContainer  } from '../config/cosmos.js';
import { FormSetting, FORM_SETTINGS_DOC_ID } from '../models/formSetting.model.js';
import { ignoreNotFound } from '../utils/cosmos.util.js';

export class FormSettingRepository {
    private readonly docId = FORM_SETTINGS_DOC_ID;

    async findByOrganizationId(organizationId: string): Promise<FormSetting | null> {
        const container = getFormSettingsContainer();
        const result = await ignoreNotFound(
            container.item(this.docId, organizationId).read<FormSetting>()
        );
        return result?.resource || null;
    }

    async upsert(formSetting: FormSetting): Promise<FormSetting> {
        const container = getFormSettingsContainer ();
        const { resource } = await container.items.upsert<FormSetting>(formSetting);
        return resource!;
    }
}

export const formSettingRepository = new FormSettingRepository();