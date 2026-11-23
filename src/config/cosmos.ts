import { CosmosClient, Container } from '@azure/cosmos';

let cosmosClientInstance: CosmosClient | null = null;
let taskContainerInstance: Container | null = null;
let formSettingsContainerInstance: Container | null = null;

export function getCosmosClient(): CosmosClient {
  if (cosmosClientInstance) return cosmosClientInstance;

  const connectionString = process.env.COSMOS_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error(
      `Environment variable COSMOS_CONNECTION_STRING belum dikonfigurasi di local.settings.json!`
    )
  }

  cosmosClientInstance = new CosmosClient(connectionString);
  return cosmosClientInstance;
}

export function getTaskContainer(): Container {
  if (taskContainerInstance)  return taskContainerInstance;

  const client = getCosmosClient();
  const databaseName = process.env.COSMOS_DATABASE_NAME || 'TaskApp';
  const containerName = process.env.COSMOS_CONTAINER_NAME || 'Tasks';

  taskContainerInstance = client.database(databaseName).container(containerName);
  return taskContainerInstance;
}

export function getFormSettingsContainer(): Container {
  if (formSettingsContainerInstance) return formSettingsContainerInstance;

  const client = getCosmosClient();
  const databaseName = process.env.COSMOS_DATABASE_NAME || 'TaskApp';
  const containerName = process.env.COSMOS_FORM_SETTINGS_CONTAINER_NAME || 'FormSettings';

  formSettingsContainerInstance = client.database(databaseName).container(containerName);

  return formSettingsContainerInstance;
}

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const container = getTaskContainer();
    await container.read();
    return true;
  } catch {
    return false;
  }
}