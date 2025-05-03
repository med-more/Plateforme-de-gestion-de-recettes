import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../../contexts/AuthContext"
import { LogOut, User, Home, PlusCircle, Menu, X, ChevronDown, ChefHat } from "lucide-react"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMobileMenuOpen(false)
  }

  const navAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-2">
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="text-orange-500"
            >
              <ChefHat size={28} strokeWidth={2.5} />
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex"
            >
              <span className="text-orange-500 text-2xl font-bold">Globe</span>
              <span className="text-orange-700 text-2xl font-bold">Cooker</span>
            </motion.div>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <motion.nav
          className="hidden md:flex items-center space-x-6"
          initial="hidden"
          animate="visible"
          variants={navAnimation}
        >
          <motion.div variants={itemAnimation}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-medium hover:text-orange-500 transition-colors flex items-center gap-1 ${
                  isActive ? "text-orange-500" : "text-gray-700"
                }`
              }
            >
              <Home size={18} />
              <span>Home</span>
            </NavLink>
          </motion.div>

          <motion.div variants={itemAnimation}>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                `font-medium hover:text-orange-500 transition-colors flex items-center gap-1 ${
                  isActive ? "text-orange-500" : "text-gray-700"
                }`
              }
            >
              <PlusCircle size={18} />
              <span>Create Recipe</span>
            </NavLink>
          </motion.div>

          {isAuthenticated ? (
            <motion.div variants={itemAnimation} className="relative group">
              <div className="flex items-center cursor-pointer">
                <span>{user?.name}</span>
                <ChevronDown size={16} className="ml-1" />
              </div>

              <motion.div
                className="absolute right-0 pt-2 hidden group-hover:block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-md shadow-lg py-2 w-48">
                  <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors">
                    <User size={16} className="mr-2" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-500"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div variants={itemAnimation} className="flex items-center space-x-4">
              <Link to="/login" className="font-medium hover:text-orange-500 transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary flex items-center gap-1">
                <User size={16} />
                <span>Register</span>
              </Link>
            </motion.div>
          )}
        </motion.nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden bg-white shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container-custom py-4 flex flex-col space-y-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-medium py-2 hover:text-orange-500 transition-colors flex items-center gap-2 ${
                  isActive ? "text-orange-500" : "text-gray-700"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                `font-medium py-2 hover:text-orange-500 transition-colors flex items-center gap-2 ${
                  isActive ? "text-orange-500" : "text-gray-700"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <PlusCircle size={18} />
              <span>Create Recipe</span>
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `font-medium py-2 hover:text-orange-500 transition-colors flex items-center gap-2 ${
                      isActive ? "text-orange-500" : "text-gray-700"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Profile</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-left font-medium py-2 text-red-500 flex items-center gap-2"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="font-medium py-2 hover:text-orange-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-center flex items-center justify-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={16} />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  )
}

export default Navbar
