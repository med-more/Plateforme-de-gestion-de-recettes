import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, AlertCircle } from "lucide-react"

const EditRecipe = () => {
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)



  if (isLoading || loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <motion.div
          className="flex flex-col items-center bg-white p-10 rounded-2xl shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-16 h-16 mb-4">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-orange-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-t-4 border-orange-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading recipe...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container-custom">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-2xl mx-auto border border-red-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
            <p className="mb-8 text-gray-600">
              {error === "Recipe not found"
                ? "The recipe you're looking for doesn't exist or has been removed."
                : "You can only edit recipes that you've created."}
            </p>
            <motion.button
              onClick={() => navigate(-1)}
              className="btn-primary flex items-center gap-2 mx-auto px-6 py-3 rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container-custom">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back</span>
        </button>

        <div className="max-w-5xl mx-auto">
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8 bg-orange-500"></div>
              <span className="text-orange-500 uppercase tracking-wider text-sm font-medium">Refine Your Creation</span>
              <div className="h-px w-8 bg-orange-500"></div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Edit Recipe</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Update and perfect your culinary masterpiece</p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Edit className="text-orange-500" size={24} />
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
              {recipe && <RecipeForm initialValues={recipe} isEditing={true} />}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EditRecipe
