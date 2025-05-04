import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { toast } from "react-toastify"
import { CheckCircle, ThumbsUp } from "lucide-react"
import mockRecipes from "../data/mockRecipes"

const RecipesContext = createContext()

export function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState(() => {
    const storedRecipes = localStorage.getItem("recipes")
    return storedRecipes ? JSON.parse(storedRecipes) : mockRecipes
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes))
  }, [recipes])

  const showToast = (type, message, icon) => {
    toast[type](message, {
      icon,
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  const getAllRecipes = useCallback(async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600))
    setLoading(false)
    return recipes
  }, [recipes])

  const getRecipeById = useCallback(
    async (id) => {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 400))
      const recipe = recipes.find((r) => r.id === id)
      setLoading(false)
      return recipe
    },
    [recipes],
  )

  const createRecipe = useCallback(async (recipeData) => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newRecipe = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...recipeData,
    }

    setRecipes((prev) => [newRecipe, ...prev])
    setLoading(false)
    showToast("success", "Recipe created successfully!", <CheckCircle className="text-green-500 w-5 h-5" />)
    return newRecipe
  }, [])

  const updateRecipe = useCallback(async (id, recipeData) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    setRecipes((prev) => prev.map((recipe) => (recipe.id === id ? { ...recipe, ...recipeData } : recipe)))

    setLoading(false)
    showToast("success", "Recipe updated successfully!", <CheckCircle className="text-green-500 w-5 h-5" />)
    return true
  }, [])

  const deleteRecipe = useCallback(async (id) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))

    setLoading(false)
    showToast("info", "Recipe deleted successfully", <ThumbsUp className="text-blue-500 w-5 h-5" />)
    return true
  }, [])

  const getUserRecipes = useCallback(
    async (userId) => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 600))

      const userRecipes = recipes.filter((recipe) => recipe.authorId === userId)

      setLoading(false)
      return userRecipes
    },
    [recipes],
  )

  const value = {
    recipes,
    loading,
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getUserRecipes,
    showToast,
  }

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
}

export const useRecipes = () => {
  const context = useContext(RecipesContext)
  if (!context) {
    throw new Error("useRecipes must be used within a RecipesProvider")
  }
  return context
}
