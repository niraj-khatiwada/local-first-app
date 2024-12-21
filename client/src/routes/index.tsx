import { createFileRoute } from "@tanstack/react-router"
import { useQuery, usePowerSync } from "@powersync/react"
import { DBSchema } from "~/db/schema"
import { useState } from "react"
import { db as pdb } from "../db"

// Preload
const _todos: DBSchema["todo"][] = await pdb.getAll("SELECT * FROM todo")

function Home(): React.ReactNode {
  const { data: todos } = useQuery<DBSchema["todo"]>("SELECT * FROM todo")

  console.log(JSON.stringify(todos, null, 2))

  return (
    <div>
      <h1 className="text-3xl">Todos:</h1>
      <CreateTodo />
      {((todos?.length ? todos : _todos) ?? [])?.map(todo => (
        <TodoItem
          key={todo?.id}
          id={todo?.id}
          title={todo?.title as string}
          isCompleted={Boolean(todo?.isCompleted)}
        />
      ))}
    </div>
  )
}
function CreateTodo() {
  const db = usePowerSync()

  const [title, setTitle] = useState("")

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt?.preventDefault()
    if (title) {
      await db.execute(
        "INSERT INTO todo(id, createdAt, title, isCompleted) VALUES(uuid(), datetime('now'), ?, ?)",
        [title, false]
      )
      setTitle("")
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        className="rounded py-1 px-2 text-black"
        name="title"
        required
        placeholder="Enter a new todo..."
        value={title}
        onChange={evt => setTitle(evt?.target?.value)}
      />
    </form>
  )
}

const TodoItem = ({
  id,
  title,
  isCompleted = false,
}: {
  id: string
  title: string
  isCompleted?: boolean
}) => {
  const db = usePowerSync()

  const handleCheckboxChange = async () => {
    await db.execute("UPDATE todo SET isCompleted = ? WHERE id = ?", [
      isCompleted ? "0" : "1",
      id,
    ])
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        margin: "8px 0",
        backgroundColor: isCompleted ? "#e0ffe0" : "#ffe0e0",
        display: "flex",
      }}
    >
      <input
        id={`complete-todo-${id}`}
        type="checkbox"
        checked={isCompleted}
        onChange={handleCheckboxChange}
        className="mr-2"
      />
      <label
        className="text-black"
        htmlFor={`complete-todo-${id}`}
        style={{ textDecoration: isCompleted ? "line-through" : "none" }}
      >
        {title}
      </label>
    </div>
  )
}

export const Route = createFileRoute("/")({
  component: Home,
})
