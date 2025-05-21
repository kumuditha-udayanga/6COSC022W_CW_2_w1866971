"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { User } from "@/lib/types"
import Cookies from "js-cookie"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const apiKey = Cookies.get("apiKey")
    const userId = Cookies.get("userId")
    const username = Cookies.get("username")

    if (apiKey && userId) {
      setUser({
        userId: Number(userId),
        apiKey,
        username: username || "",
      })

      api.setApiKey(apiKey)
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { apiKey, userId } = await api.login(email, password)

      const profile = await api.getUserProfile(userId)
      const username = profile.user.username

      Cookies.set("apiKey", apiKey, { expires: 7 })
      Cookies.set("userId", userId.toString(), { expires: 7 })
      Cookies.set("username", username, { expires: 7 })

      setUser({ userId, apiKey, username })

      api.setApiKey(apiKey)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      if (user) {
        await api.logout()
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      Cookies.remove("apiKey")
      Cookies.remove("userId")
      Cookies.remove("username")
      setUser(null)
      api.setApiKey(null)
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}
