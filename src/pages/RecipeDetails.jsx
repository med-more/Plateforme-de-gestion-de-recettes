import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useRecipes } from "../contexts/RecipesContext"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-toastify"
import {
  Clock,
  Users,
  Calendar,
  ChefHat,
  Edit,
  Trash2,
  ArrowLeft,
  Minus,
  Plus,
  Award,
  Tag,
  AlertTriangle,
} from "lucide-react"

const RecipeDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getRecipeById, deleteRecipe, loading } = useRecipes()
  const { user } = useAuth()

  const [recipe, setRecipe] = useState(null)
  const [servings, setServings] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchRecipe = async () => {
      const recipeData = await getRecipeById(id)
      if (recipeData) {
        setRecipe(recipeData)
        setServings(recipeData.servings)
      } else {
        navigate("/")
      }
    }

    fetchRecipe()
  }, [id, getRecipeById, navigate])

  const handleDeleteRecipe = () => {
    toast.warning(
      <div>
        <p className="font-medium mb-2">Are you sure you want to delete this recipe?</p>
        <p className="text-sm mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => toast.dismiss()} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm">
            Cancel
          </button>
          <button onClick={confirmDelete} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">
            Delete
          </button>
        </div>
      </div>,
      {
        icon: <AlertTriangle className="text-amber-500 w-5 h-5" />,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        className: "bg-amber-50 border-l-4 border-amber-500",
      },
    )
  }

  const confirmDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteRecipe(id)
      toast.dismiss() 
      navigate("/")
    } catch (error) {
      toast.error("Failed to delete recipe")
      setIsDeleting(false)
    }
  }

  const adjustServings = (newServings) => {
    if (newServings >= 1) {
      setServings(newServings)
    }
  }

  const getAdjustedIngredient = (ingredient) => {
    const parts = ingredient.split(" ")
    if (parts.length > 1 && !isNaN(parts[0])) {
      const originalQuantity = Number.parseFloat(parts[0])
      const adjustedQuantity = (originalQuantity * servings) / recipe.servings
      parts[0] = adjustedQuantity.toFixed(1).replace(/\.0$/, "")
      return parts.join(" ")
    }
    return ingredient
  }

  if (loading || !recipe) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  const isOwner = user && user.id === recipe.authorId

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <motion.div className="p-4" variants={itemVariants}>
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors">
              <ArrowLeft size={16} className="mr-1" />
              <span>Back to recipes</span>
            </Link>
          </motion.div>

          <motion.div className="relative h-64 md:h-80" variants={itemVariants}>
            <motion.img
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <div className="flex items-center mb-2">
                <motion.span
                  className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                >
                  {recipe.category}
                </motion.span>
                <span className="mx-2">•</span>
                <motion.span className="flex items-center gap-1" whileHover={{ scale: 1.05 }}>
                  <Award size={16} />
                  <span>{recipe.difficulty}</span>
                </motion.span>
              </div>
              <motion.h1
                className="text-2xl md:text-3xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {recipe.title}
              </motion.h1>
              <div className="flex items-center text-sm">
                <Clock size={16} className="mr-1" />
                <span>{recipe.prepTime + recipe.cookTime} min</span>
                <span className="mx-2">•</span>
                <Users size={16} className="mr-1" />
                <span>{recipe.servings} servings</span>
                <span className="mx-2">•</span>
                <Calendar size={16} className="mr-1" />
                <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>

          <div className="p-6">
            <motion.div
              className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {recipe.authorName.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{recipe.authorName}</p>
                  <p className="text-sm text-gray-500">Recipe Author</p>
                </div>
              </div>

              {isOwner && (
                <div className="flex space-x-3">
                  <motion.button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
                    onClick={() => navigate(`/edit-recipe/${id}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit size={16} />
                    <span>Edit Recipe</span>
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1"
                    onClick={handleDeleteRecipe}
                    disabled={isDeleting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={16} />
                    <span>{isDeleting ? "Deleting..." : "Delete Recipe"}</span>
                  </motion.button>
                </div>
              )}
            </motion.div>

            <motion.div className="mb-8" variants={itemVariants}>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span>Description</span>
              </h2>
              <p className="text-gray-700">{recipe.description}</p>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={itemVariants}>
              <div className="md:col-span-1">
                <motion.div
                  className="bg-gray-50 rounded-lg p-6"
                  whileHover={{
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <ChefHat size={20} className="text-orange-500" />
                      <span>Ingredients</span>
                    </h2>
                    <div className="flex items-center">
                      <motion.button
                        onClick={() => adjustServings(servings - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                        disabled={servings <= 1}
                        whileHover={{ scale: 1.1, backgroundColor: "#e5e7eb" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus size={16} />
                      </motion.button>
                      <span className="mx-3 flex items-center">
                        <Users size={16} className="mr-1" />
                        <span>{servings}</span>
                      </span>
                      <motion.button
                        onClick={() => adjustServings(servings + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                        whileHover={{ scale: 1.1, backgroundColor: "#e5e7eb" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus size={16} />
                      </motion.button>
                    </div>
                  </div>

                  <motion.ul
                    className="space-y-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.05,
                        },
                      },
                    }}
                  >
                    {recipe.ingredients.map((ingredient, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 mr-2"></span>
                        <span>{getAdjustedIngredient(ingredient)}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              </div>

              <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-4">Instructions</h2>
                <motion.ol
                  className="space-y-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {recipe.instructions.map((instruction, index) => (
                    <motion.li
                      key={index}
                      className="flex"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <div className="flex-shrink-0 mr-4">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold"
                          whileHover={{ scale: 1.1 }}
                        >
                          {index + 1}
                        </motion.div>
                      </div>
                      <div>
                        <p className="text-gray-700">{instruction}</p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ol>
              </div>
            </motion.div>

            {recipe.tags && recipe.tags.length > 0 && (
              <motion.div className="mt-8" variants={itemVariants}>
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Tag size={20} className="text-orange-500" />
                  <span>Tags</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                              {recipe.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{ scale: 1.05, backgroundColor: "#fef3c7", color: "#92400e" }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RecipeDetails
