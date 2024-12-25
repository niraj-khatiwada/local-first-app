import { createSchema, definePermissions } from "@rocicorp/zero"
import todoSchema from "./todo"

export const schema = createSchema({
  version: 1,
  tables: {
    todo: todoSchema,
  },
})

export const permissions = definePermissions(schema, () => {
  return {}
})

export type Schema = typeof schema
