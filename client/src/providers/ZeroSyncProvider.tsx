import { Zero } from "@rocicorp/zero"
import { ZeroProvider } from "@rocicorp/zero/react"
import { schema } from "~/db/schema"

export const zero = new Zero({
  userID: "74afeb59-575b-404c-ad40-e14d888eaa03",
  auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NGFmZWI1OS01NzViLTQwNGMtYWQ0MC1lMTRkODg4ZWFhMDMiLCJoYXNoIjoiNDBhYzVjMzIyOGYzMzRlZjhmYmQ0M2NhMWQwZmNmY2E4NDFhMTNhMzU5ZDYwZGQ5YTE1MDc1YWE3Y2RlNjY3ZiIsImlhdCI6MTczNTE0MzMxMywiZXhwIjoxNzM1NzQ4MTEzfQ.tVbX6KGgQn_sLSszZsWsL8tnZYHHBwHthsvCO929uBI",
  server: import.meta.env.VITE_SYNC_SERVER_URI,
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
