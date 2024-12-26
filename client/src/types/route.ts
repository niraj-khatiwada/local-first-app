import { ParseRoute } from "@tanstack/react-router"
import { routeTree } from "~/routeTree.gen"

export type AppRoutes = ParseRoute<typeof routeTree>["fullPath"]
