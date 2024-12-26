import { useNavigate } from "@tanstack/react-router"
import React from "react"
import { validate as validateUUID } from "uuid"
import { AppRoutes } from "~/types/route"

type withProtectedRouteOptions = {
  redirectURI?: AppRoutes
}

type PropsWithChildren<P> = P & { children?: React.ReactNode }

const withProtectedRouteDefaultOptions: withProtectedRouteOptions = {
  redirectURI: "/login",
}

function withProtectedRoute<
  T extends PropsWithChildren<React.JSX.IntrinsicAttributes>,
>(Component: React.FC<T>, options = withProtectedRouteDefaultOptions) {
  const { redirectURI } = {
    ...withProtectedRouteDefaultOptions,
    ...options,
  }
  return (props: PropsWithChildren<T>) => {
    const navigate = useNavigate()

    const isAuthenticated = React.useMemo(() => {
      const userId = window.localStorage.getItem("userId")
      return validateUUID(userId) && !(userId == null)
    }, [])

    if (!isAuthenticated) {
      navigate({ to: redirectURI })
      return null
    }

    return <Component {...props} />
  }
}

export default withProtectedRoute
