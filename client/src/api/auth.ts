const API_URI = import.meta.env.VITE_SERVER_URI

export const login = async function (body: {
  email: string
  password: string
}) {
  const res = await fetch(`${API_URI}/v1/auth/email/login`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json", // Set the content type
    },
  })
  if (!res.ok) {
    throw await res.json()
  }
  return res.json()
}

export const register = async function (body: {
  username: string
  email: string
  password: string
}) {
  const res = await fetch(`${API_URI}/v1/auth/email/register`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json", // Set the content type
    },
  })
  if (!res.ok) {
    throw await res.json()
  }
  return res.json()
}
