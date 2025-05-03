import { createContext, useContext, useState, useCallback } from "react"
import { toast } from "react-toastify"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

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

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (email === "user@example.com" && password === "password") {
        const mockUser = {
          id: "1",
          name: "John Doe",
          email,
          role: "user",
        }

        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))
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
  }, [])

  const register = useCallback(async (name, email, password) => {
    try {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockUser = {
        id: Date.now().toString(),
        name,
        email,
        role: "user",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      showSuccessToast("Account created successfully! Welcome to 404.js")
      return true
    } catch (error) {
      showErrorToast("Registration failed. Please try again later")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

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
