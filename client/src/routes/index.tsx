import { useQuery, useZero } from "@rocicorp/zero/react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { Schema } from "~/db/schema"
import { v4 as uuid } from "uuid"
import { Zero } from "@rocicorp/zero"

async function preload(zero: Zero<Schema>) {
  const { complete } = zero.query.todo
    .orderBy("createdAt", "desc")
    .limit(100)
    .preload()
  complete
    .then(() => {
      console.log("preload complete.")
    })
    .catch(err => {
      console.log("preload error", err)
    })
}

function Home(): React.ReactNode {
  const zero = useZero<Schema>()

  const [todos] = useQuery(
    zero.query.todo.orderBy("createdAt", "desc").limit(100)
  )

  return (
    <div>
      <h1 className="text-3xl">Todos:</h1>
      <CreateTodo />
      <div className="my-5">
        {((todos?.length ? todos : []) ?? [])?.map(todo => (
          <TodoItem
            key={todo?.id}
            id={todo?.id}
            title={todo?.title as string}
            isCompleted={Boolean(todo?.isCompleted)}
          />
        ))}
      </div>
    </div>
  )
}
function CreateTodo() {
  const zero = useZero<Schema>()
  const [title, setTitle] = useState("")

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt?.preventDefault()
    if (title) {
      await zero.mutate.todo.insert({
        id: uuid(),
        title,
        isCompleted: false,
        createdAt: +new Date(),
        updatedAt: +new Date(),
      })
      await preload(zero)
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
  const zero = useZero<Schema>()

  const handleCheckboxChange = async () => {
    await zero.mutate.todo.update({
      id,
      isCompleted: !isCompleted,
    })
    await preload(zero)
  }

  const handleDelete = async () => {
    await zero.mutate.todo.delete({ id })
    await preload(zero)
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
        maxWidth: "576px",
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
      <button
        className="ml-auto bg-red-400 rounded-md px-2"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  )
}

export const Route = createFileRoute("/")({
  component: Home,
})
