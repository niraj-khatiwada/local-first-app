import { useNavigate } from "@tanstack/react-router"
import React from "react"
import useSession from "~/hooks/useSession"
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
    const session = useSession()

    if (session?.isAuthenticated) {
      navigate({ to: redirectURI })
      return null
    }

    return <Component {...props} />
  }
}

export default withPreventedRoute
