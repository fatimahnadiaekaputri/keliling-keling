'use client'

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"


export default function LoginPage() {
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi input kosong
    if (!username || !password) {
      setError("Username and password are required.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Simpan token dari response body
      Cookies.set("token", data.token, { expires: 1, path: "/" })

      const profileRes = await fetch("http://localhost:5000/api/user/me", {
        credentials: "include",
      })

      if (!profileRes.ok) {
        throw new Error(data.message || "Failed to fetch user profile")
      }

      const profile = await profileRes.json()

      if (profile.role === "admin") {
        router.push("/admin/article/new")
      } else {
        alert("Anda bukan admin")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-center">Login</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Submit"}
        </Button>
      </form>
    </div>
  )
}
