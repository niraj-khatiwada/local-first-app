import { column, Schema, Table } from "@powersync/web"

export const todo = new Table({
  // id is automatically handled
  title: column.text,
  description: column.text,
  completedAt: column.text,
  isCompleted: column.integer,
  createdAt: column.text,
})
