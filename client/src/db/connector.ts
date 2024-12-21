import {
  PowerSyncBackendConnector,
  UpdateType,
  type RemoteConnector,
} from '@powersync/web'

export class Connector {
  serverConnectionClient: string

  constructor() {
    this.serverConnectionClient = import.meta?.env?.VITE_API_URL
  }

  async fetchCredentials(): ReturnType<
    PowerSyncBackendConnector['fetchCredentials']
  > {
    return {
      endpoint: import.meta?.env?.VITE_SYNC_API_URL as string,
      token: window.localStorage.getItem('access_token') as string,
    }
  }

  async uploadData(database) {
    // Implement uploadData to send local changes to your backend service.
    // You can omit this method if you only want to sync data from the database to the client
    // See example implementation here: https://docs.powersync.com/client-sdk-references/javascript-web#3-integrate-with-your-backend
  }

  isReadyToFetch(): boolean {
    return Boolean(window.localStorage.getItem('access_token'))
  }
}
