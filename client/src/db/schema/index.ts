import { column, Schema, Table } from "@powersync/web"

import { todo } from "./todo"

export const appSchema = new Schema({
  todo,
})

export type DBSchema = (typeof appSchema)["types"]
