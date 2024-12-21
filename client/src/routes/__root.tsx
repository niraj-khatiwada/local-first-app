import * as React from "react"
import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { initSync } from "../db"

initSync()

const isDev = import.meta.env.DEV

import Logger from "js-logger"

if (isDev) {
  Logger.useDefaults()
}

function Root(): React.ReactNode {
  return (
    <React.Fragment>
      <Outlet />
      {isDev ? <TanStackRouterDevtools position="bottom-right" /> : null}
    </React.Fragment>
  )
}

export const Route = createRootRoute({
  component: Root,
})
