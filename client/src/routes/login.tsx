import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { login } from "~/api/auth"
import { storageKey } from "~/constants"
import withPreventedRoute from "~/hoc/withPreventedRoute"

function Login() {
  const [formData, setFormData] = useState({
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
      const res: { userId: string; accessToken: string } = await login(formData)
      if (res?.userId) {
        window.localStorage.setItem(storageKey.userId, res?.userId)
        window.localStorage.setItem(storageKey.accessToken, res?.accessToken)
        window.localStorage.removeItem(storageKey.localUserId)
        window.location.reload()
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
          SignIn
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md transition"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            SignUp
          </Link>
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/login")({
  component: withPreventedRoute(Login),
})
