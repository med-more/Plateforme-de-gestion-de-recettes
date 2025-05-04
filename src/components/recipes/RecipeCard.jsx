import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Clock, Users, Calendar, ChefHat } from "lucide-react"

const RecipeCard = ({ recipe }) => {
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/recipe/${recipe.id}`} className="flex flex-col h-full">
        <div className="relative h-56 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
          <motion.img
            src={recipe.image || "/placeholder.svg"}
            alt={recipe.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute top-4 right-4 z-10">
            <motion.span
              className="bg-orange-500 text-white text-xs uppercase tracking-wider py-1 px-3 rounded-full"
              whileHover={{ scale: 1.1 }}
            >
              {recipe.category}
            </motion.span>
          </div>
          <div className="absolute bottom-0 left-0 p-4 text-white z-10 w-full">
            <h3 className="text-xl font-bold line-clamp-1 group-hover:text-orange-300 transition-colors">
              {recipe.title}
            </h3>
            <div className="flex items-center mt-1 text-sm text-white/90">
              <Clock size={14} className="mr-1" />
              <span>{recipe.cookTime + recipe.prepTime} min</span>
              <span className="mx-2">•</span>
              <Users size={14} className="mr-1" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 flex items-center">
              <ChefHat size={14} className="mr-1" />
              <span>{recipe.difficulty}</span>
            </span>
          </div>

          <p className="text-gray-600 line-clamp-3 text-sm mb-4 flex-grow">{recipe.description}</p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                {recipe.authorName.charAt(0)}
              </div>
              <span className="ml-2 text-sm text-gray-600">{recipe.authorName}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={14} className="mr-1" />
              <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default RecipeCard
