import { Zero } from "@rocicorp/zero"
import { ZeroProvider } from "@rocicorp/zero/react"
import { schema } from "~/db/schema"
import { v4 as uuid } from "uuid"
import { useMemo } from "react"

const getInstance = (userId: string) =>
  new Zero({
    userID: userId,
    auth: () => window.localStorage.getItem("accessToken") as string,
    server: import.meta.env.VITE_SYNC_SERVER_URI,
    schema,
    kvStore: "idb",
  })

export default function ZeroSyncProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const instance = useMemo(() => {
    const remoteUserId = window.localStorage.getItem("userId")
    if (remoteUserId) {
      return getInstance(remoteUserId)
    }
    const localUserId = window.localStorage.getItem("localUserId")
    if (localUserId) {
      return getInstance(localUserId)
    }
    const id = uuid()
    window.localStorage.setItem("localUserId", id)
    return getInstance(id)
  }, [])

  return <ZeroProvider zero={instance}>{children}</ZeroProvider>
}
