import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { register } from "~/api/auth"
import withPreventedRoute from "~/hoc/withPreventedRoute"

function SignUp() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res: { userId: string } = await register(formData)
      if (res?.userId) {
        navigate({ to: "/login" })
      } else {
        throw new Error()
      }
    } catch (error: any) {
      window.alert(`Error logging in... ${error?.message ?? ""}`)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="shadow-md rounded-md p-8 w-full max-w-sm">
        <Link to="/">
          <h1 className="text-5xl text-center mb-6">To✍️Do</h1>
        </Link>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none text-black"
              placeholder="Enter your username"
              required
              minLength={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none text-black"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none text-black"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md transition"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/signup")({
  component: withPreventedRoute(SignUp),
})
