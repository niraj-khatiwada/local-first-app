import ReactDOM from "react-dom/client"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import "./index.css"

import { routeTree } from "./routeTree.gen"
import QueryClientProvider from "./providers/QueryClientProvider"
import ZeroSyncProvider from "./providers/ZeroSyncProvider"

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
    <ZeroSyncProvider>
      <QueryClientProvider>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ZeroSyncProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
)
