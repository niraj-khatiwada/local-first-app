import ReactDOM from "react-dom/client"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { PowerSyncContext } from "@powersync/react"

import "./index.css"
import { routeTree } from "./routeTree.gen"
import { db } from "./db"
import QueryClientProvider from "./providers/QueryClientProvider"

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function App(): React.ReactNode {
  return (
    <PowerSyncContext.Provider value={db}>
      <QueryClientProvider>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </PowerSyncContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
)
