import { createTableSchema } from "@rocicorp/zero"

const todoSchema = createTableSchema({
  tableName: "todo",
  columns: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string", optional: true },
    isCompleted: { type: "boolean" },
    completedAt: { type: "number", optional: true },
    createdAt: { type: "number" },
    updatedAt: { type: "number" },
  },
  primaryKey: ["id"],
})

export default todoSchema
