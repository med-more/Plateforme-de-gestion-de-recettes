import { motion } from "framer-motion"
import RecipeForm from "../components/recipes/RecipeForm"
import { ChefHat, Utensils, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const CreateRecipe = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container-custom">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors mb-6">
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="max-w-5xl mx-auto">
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8 bg-orange-500"></div>
              <span className="text-orange-500 uppercase tracking-wider text-sm font-medium">
                Share Your Culinary Art
              </span>
              <div className="h-px w-8 bg-orange-500"></div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Create a New Recipe</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Share your culinary masterpiece with our community of food enthusiasts
            </p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
              <ChefHat className="text-orange-500" size={24} />
            </div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Utensils className="text-orange-500" size={24} />
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
              <RecipeForm />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CreateRecipe
