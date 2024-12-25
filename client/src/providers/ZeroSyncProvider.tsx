import { Zero } from "@rocicorp/zero"
import { ZeroProvider } from "@rocicorp/zero/react"
import { schema } from "~/db/schema"

export const zero = new Zero({
  userID: "1",
  //   auth: () => {
  //
  //   },
  server: import.meta.env.VITE_SERVER_URI,
  schema,
  kvStore: "idb",
})

export default function ZeroSyncProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ZeroProvider zero={zero}>{children}</ZeroProvider>
}
