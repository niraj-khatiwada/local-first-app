import { ParseRoute, useNavigate } from "@tanstack/react-router"
import React from "react"
import { validate as validateUUID } from "uuid"
import { AppRoutes } from "~/types/route"

type withPreventedRouteOptions = {
  redirectURI?: AppRoutes
}
type PropsWithChildren<P> = P & { children?: React.ReactNode }

const withPreventedRouteDefaultOptions: withPreventedRouteOptions = {
  redirectURI: "/",
}

function withPreventedRoute<
  T extends PropsWithChildren<React.JSX.IntrinsicAttributes>,
>(Component: React.FC<T>, options = withPreventedRouteDefaultOptions) {
  const { redirectURI } = { ...withPreventedRouteDefaultOptions, ...options }
  return (props: PropsWithChildren<T>) => {
    const navigate = useNavigate()

    const isAuthenticated = React.useMemo(() => {
      const userId = window.localStorage.getItem("userId")
      return validateUUID(userId) && !(userId == null)
    }, [])

    if (isAuthenticated) {
      navigate({ to: redirectURI })
      return null
    }

    return <Component {...props} />
  }
}

export default withPreventedRoute
