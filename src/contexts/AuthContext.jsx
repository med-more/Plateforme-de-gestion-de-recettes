"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { toast } from "react-toastify"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem("registeredUsers")
    return storedUsers ? JSON.parse(storedUsers) : []
  })

  useEffect(() => {
    localStorage.setItem("registeredUsers", JSON.stringify(users))
  }, [users])

  const checkAuth = useCallback(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const showSuccessToast = (message) => {
    toast.success(message, {
      icon: <CheckCircle className="text-green-500 w-5 h-5" />,
      className: "bg-green-50 border-l-4 border-green-500",
    })
  }

  const showErrorToast = (message) => {
    toast.error(message, {
      icon: <XCircle className="text-red-500 w-5 h-5" />,
      className: "bg-red-50 border-l-4 border-red-500",
    })
  }

  const showWarningToast = (message) => {
    toast.warning(message, {
      icon: <AlertTriangle className="text-amber-500 w-5 h-5" />,
      className: "bg-amber-50 border-l-4 border-amber-500",
    })
  }

  const login = useCallback(
    async (email, password) => {
      try {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 800))

        const foundUser = users.find((u) => u.email === email && u.password === password)

        const isDefaultUser = email === "user@example.com" && password === "password"

        if (foundUser || isDefaultUser) {
          const loggedInUser = foundUser || {
            id: "1",
            name: "John Doe",
            email: "user@example.com",
            role: "user",
            avatar: "/placeholder.svg?height=100&width=100",
          }

          const { password, ...userWithoutPassword } = loggedInUser

          setUser(userWithoutPassword)
          localStorage.setItem("user", JSON.stringify(userWithoutPassword))
          showSuccessToast("Welcome back! Login successful")
          return true
        } else {
          showErrorToast("Invalid email or password")
          return false
        }
      } catch (error) {
        showErrorToast("Login failed. Please try again later")
        return false
      } finally {
        setLoading(false)
      }
    },
    [users],
  )

  const register = useCallback(
    async (name, email, password) => {
      try {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 800))

        if (users.some((user) => user.email === email)) {
          showErrorToast("A user with this email already exists")
          return false
        }

        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          password, 
          role: "user",
          avatar: "/placeholder.svg?height=100&width=100",
        }

        setUsers((prevUsers) => [...prevUsers, newUser])

        const { password: _, ...userWithoutPassword } = newUser
        setUser(userWithoutPassword)
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))

        showSuccessToast("Account created successfully! Welcome to 404.js")
        return true
      } catch (error) {
        showErrorToast("Registration failed. Please try again later")
        return false
      } finally {
        setLoading(false)
      }
    },
    [users],
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("user")
    showSuccessToast("You've been logged out successfully")
  }, [])

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
