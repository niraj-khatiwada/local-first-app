import { DEFAULT_REMOTE_LOGGER, PowerSyncDatabase } from "@powersync/web"
import { Connector } from "./connector"
import { appSchema } from "./schema"

export const db = new PowerSyncDatabase({
  schema: appSchema,
  database: {
    dbFilename: "local.db",
  },
  logger: DEFAULT_REMOTE_LOGGER,
})

export const initSync = async () => {
  const connector = new Connector()
  if (db.connected || !connector.isReadyToFetch()) {
    return
  }
  try {
    console.log("Connecting to sync engine...")
    await db.connect(connector)
    console.log("Connected to sync engine...", db.currentStatus)
  } catch (error) {
    console.log("Failed to connect to sync engine...", error)
    if (!db.connected) {
      setTimeout(initSync, 3000)
    }
  }
  return db
}
