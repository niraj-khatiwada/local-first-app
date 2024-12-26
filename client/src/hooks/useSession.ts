import { useMemo } from "react"
import { storageKey } from "~/constants"

function useSession() {
  const isAuthenticated = useMemo(() => {
    return window.localStorage.getItem(storageKey.accessToken)
  }, [])

  const userId = useMemo(() => {
    return window.localStorage.getItem(
      isAuthenticated ? storageKey.userId : storageKey.localUserId
    )
  }, [isAuthenticated])

  return {
    isAuthenticated,
    userId,
  }
}

export default useSession
