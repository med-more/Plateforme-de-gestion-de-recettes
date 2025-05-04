import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion"
import RecipeCard from "../components/recipes/RecipeCard"
import { useRecipes } from "../contexts/RecipesContext"
import {
  Search,
  Filter,
  ChefHat,
  ArrowRight,
  ChevronDown,
  Star,
  TrendingUp,
  Clock,
  Sliders,
  X,
  ChevronUp,
  Users,
  Timer,
  Award,
} from "lucide-react"
import { Link } from "react-router-dom"
import h1Image from "../assets/Heroimages/h1.jpeg"
import h2Image from "../assets/Heroimages/h2.jpeg"
import h3Image from "../assets/Heroimages/h3.jpeg"
import h4Image from "../assets/Heroimages/h4.jpeg"
import h5Image from "../assets/Heroimages/h5.jpeg"
import h6Image from "../assets/Heroimages/h6.jpeg"


const Home = () => {
  const { getAllRecipes, loading } = useRecipes()
  const [recipes, setRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const heroRef = useRef(null)
  const featuredRef = useRef(null)

  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    difficulty: [],
    cookTime: null,
    servings: null,
  })
  const [sortBy, setSortBy] = useState("newest")

  const { scrollY } = useScroll()
  const springScrollY = useSpring(scrollY, { stiffness: 100, damping: 30 })
  const heroY = useTransform(springScrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(springScrollY, [0, 300], [1, 0])
  const heroScale = useTransform(springScrollY, [0, 300], [1, 1.1])
  const textY = useTransform(springScrollY, [0, 300], [0, -50])
  const textOpacity = useTransform(springScrollY, [0, 200], [1, 0])

  const heroImages = [
    {
      url: h1Image,
      title: "Artisanal Pasta",
      description: "Handcrafted pasta recipes from Italian masters",
      color: "from-purple-900/40 to-purple-700/30",
      accent: "bg-purple-500",
    },
    {
      url: h2Image,
      title: "Garden Fresh",
      description: "Vibrant salads bursting with seasonal ingredients",
      color: "from-green-900/40 to-green-700/30",
      accent: "bg-green-500",
    },
    {
      url: h3Image,
      title: "Sweet Indulgence",
      description: "Irresistible desserts for your sweet cravings",
      color: "from-amber-900/40 to-amber-700/30",
      accent: "bg-amber-500",
    },
    {
      url: h4Image,
      title: "Morning Delights",
      description: "Start your day with these energizing breakfast ideas",
      color: "from-blue-900/40 to-blue-700/30",
      accent: "bg-blue-500",
    },
    {
      url: h5Image,
      title: "Evening Elegance",
      description: "Sophisticated dinner recipes to impress your guests",
      color: "from-rose-900/40 to-rose-700/30",
      accent: "bg-rose-500",
    },
    {
      url: h6Image,
      title: "Artisanal Pasta",
      description: "Handcrafted pasta recipes from Italian masters",
      color: "from-purple-900/40 to-purple-700/30",
      accent: "bg-purple-500",
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 6000) 

    return () => clearInterval(interval)
  }, [heroImages.length])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting)
      },
      { threshold: 0.3 },
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipeData = await getAllRecipes()
      setRecipes(recipeData || [])
    }

    fetchRecipes()
  }, [getAllRecipes])

  const filterCategories = ["All", "Breakfast", "Main Dish", "Pasta", "Dessert", "Salad", "Appetizer", "Snack", "Drink"]
  const difficultyOptions = ["Easy", "Medium", "Hard"]
  const cookTimeOptions = [
    { label: "Quick (< 30 min)", value: 30 },
    { label: "Medium (30-60 min)", value: 60 },
    { label: "Long (> 60 min)", value: 61 },
  ]
  const servingsOptions = [
    { label: "1-2 people", value: 2 },
    { label: "3-4 people", value: 4 },
    { label: "5+ people", value: 5 },
  ]
  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Quickest to Make", value: "quickest" },
    { label: "Most Servings", value: "servings" },
  ]

  const filteredRecipes = recipes
    .filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = activeFilter === "All" || recipe.category === activeFilter

      const matchesDifficulty = filters.difficulty.length === 0 || filters.difficulty.includes(recipe.difficulty)

      let matchesCookTime = true
      if (filters.cookTime) {
        const totalTime = recipe.prepTime + recipe.cookTime
        if (filters.cookTime === 30) {
          matchesCookTime = totalTime < 30
        } else if (filters.cookTime === 60) {
          matchesCookTime = totalTime >= 30 && totalTime <= 60
        } else {
          matchesCookTime = totalTime > 60
        }
      }

      let matchesServings = true
      if (filters.servings) {
        if (filters.servings === 2) {
          matchesServings = recipe.servings <= 2
        } else if (filters.servings === 4) {
          matchesServings = recipe.servings > 2 && recipe.servings <= 4
        } else {
          matchesServings = recipe.servings >= 5
        }
      }

      return matchesSearch && matchesCategory && matchesDifficulty && matchesCookTime && matchesServings
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "quickest":
          return a.prepTime + a.cookTime - (b.prepTime + b.cookTime)
        case "servings":
          return b.servings - a.servings
        default:
          return 0
      }
    })

  const featuredRecipes = recipes.slice(0, 3)

  const imageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.2,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 1.2, ease: "easeOut" },
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.8 },
      },
    }),
  }

  const [direction, setDirection] = useState(1)

  useEffect(() => {
    setDirection(1) 
  }, [currentImageIndex])

  const scrollToFeatured = () => {
    featuredRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const toggleDifficultyFilter = (difficulty) => {
    setFilters((prev) => {
      const newDifficulty = [...prev.difficulty]
      if (newDifficulty.includes(difficulty)) {
        return {
          ...prev,
          difficulty: newDifficulty.filter((d) => d !== difficulty),
        }
      } else {
        return {
          ...prev,
          difficulty: [...newDifficulty, difficulty],
        }
      }
    })
  }

  const resetFilters = () => {
    setFilters({
      difficulty: [],
      cookTime: null,
      servings: null,
    })
    setSortBy("newest")
    setSearchTerm("")
    setActiveFilter("All")
  }

  const activeFiltersCount =
    (filters.difficulty.length > 0 ? 1 : 0) +
    (filters.cookTime ? 1 : 0) +
    (filters.servings ? 1 : 0) +
    (activeFilter !== "All" ? 1 : 0) +
    (searchTerm ? 1 : 0)

  return (
    <>
      <motion.section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ opacity: heroOpacity }}
      >
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale }}>
          <div className={`absolute inset-0 bg-gradient-to-r ${heroImages[currentImageIndex].color} z-10`} />

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={currentImageIndex}
              src={heroImages[currentImageIndex].url}
              alt={heroImages[currentImageIndex].title}
              className="w-full h-full object-cover"
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1.5 }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 z-5 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-white/10 animate-pulse opacity-30" />
            <div
              className="absolute bottom-20 right-20 w-64 h-64 rounded-full border border-white/10 animate-pulse opacity-20"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
            {heroImages.map((_, index) => (
              <motion.button
                key={index}
                className={`w-12 h-1 rounded-full ${
                  currentImageIndex === index ? heroImages[index].accent : "bg-white/30"
                }`}
                onClick={() => {
                  setDirection(index > currentImageIndex ? 1 : -1)
                  setCurrentImageIndex(index)
                }}
                whileHover={{ scaleX: 1.5, backgroundColor: "#ffffff" }}
                animate={{
                  scaleX: currentImageIndex === index ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div className="container-custom relative z-10 text-white" style={{ y: textY, opacity: textOpacity }}>
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="backdrop-blur-sm bg-black/20 p-10 rounded-xl border border-white/10 shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className={`h-1 w-16 ${heroImages[currentImageIndex].accent} mb-6 rounded-full`}
                layoutId="heroAccent"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.span className="text-sm uppercase tracking-wider font-medium mb-2 block">
                    {heroImages[currentImageIndex].title}
                  </motion.span>
                  <motion.h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-md leading-tight">
                    Discover <span className="text-orange-400">Exceptional</span> Recipes
                  </motion.h1>
                  <motion.p className="text-xl text-gray-100 mb-8 max-w-2xl">
                    {heroImages[currentImageIndex].description}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.a
                  href="#recipes"
                  className="btn-primary py-4 px-8 text-center flex items-center justify-center gap-2 shadow-lg rounded-full"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChefHat size={20} />
                  <span className="font-medium">Explore Recipes</span>
                </motion.a>

                <motion.a
                  href="/create"
                  className="py-4 px-8 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2 shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-medium">Share Your Recipe</span>
                  <ArrowRight size={20} />
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-6 left-0 right-0 z-20 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHeroVisible ? 1 : 0 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            onClick={scrollToFeatured}
            className="flex flex-col items-center text-white/70 hover:text-white transition-colors"
            whileHover={{ y: 5 }}
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
          >
            <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
            <ChevronDown size={20} />
          </motion.button>
        </motion.div>
      </motion.section>

      <section ref={featuredRef} className="py-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8 bg-orange-500"></div>
              <span className="text-orange-400 uppercase tracking-wider text-sm font-medium">Curated Selection</span>
              <div className="h-px w-8 bg-orange-500"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Featured Recipes</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Discover our hand-picked selection of exceptional recipes that will elevate your culinary experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                className="group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col transform group-hover:-translate-y-2">
                  <div className="relative h-60 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 opacity-60"></div>
                    <motion.img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-orange-500 text-white text-xs uppercase tracking-wider py-1 px-2 rounded-full">
                        {recipe.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-orange-300" />
                        <span className="text-white text-sm">{recipe.prepTime + recipe.cookTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-orange-300" />
                        <span className="text-white text-sm">{recipe.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-orange-400 transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-400 mb-4 flex-grow">{recipe.description.substring(0, 100)}...</p>
                    <motion.div whileHover={{ x: 5 }}>
                      <Link
                        to={`/recipe/${recipe.id}`}
                        className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium"
                      >
                        View Recipe
                        <ArrowRight size={16} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <motion.div whileHover={{ x: 5 }}>
              <a
                href="#recipes"
                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-lg font-medium border-b border-orange-400 pb-1"
              >
                View All Recipes
                <ArrowRight size={18} />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
              >
                <ChefHat size={32} />
              </motion.div>
              <motion.div
                className="text-4xl font-bold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                500+
              </motion.div>
              <p className="text-white/80">Unique Recipes</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
              >
                <Star size={32} />
              </motion.div>
              <motion.div
                className="text-4xl font-bold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                4.8
              </motion.div>
              <p className="text-white/80">Average Rating</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
              >
                <TrendingUp size={32} />
              </motion.div>
              <motion.div
                className="text-4xl font-bold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                10k+
              </motion.div>
              <p className="text-white/80">Monthly Visitors</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="recipes" className="py-24 bg-gray-50">
        <div className="container-custom">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8 bg-orange-500"></div>
              <span className="text-orange-500 uppercase tracking-wider text-sm font-medium">
                Browse Our Collection
              </span>
              <div className="h-px w-8 bg-orange-500"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Explore All Recipes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover delicious recipes shared by our community of food enthusiasts. Use our advanced filters to find
              exactly what you're looking for.
            </p>
          </motion.div>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                <motion.div
                  className={`relative flex-grow w-full ${
                    isSearchFocused ? "ring-2 ring-orange-500 rounded-xl" : "rounded-xl border border-gray-200"
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <motion.div
                    className={`absolute left-4 top-4 transition-all ${
                      isSearchFocused ? "text-orange-500" : "text-gray-400"
                    }`}
                    animate={{ scale: isSearchFocused ? 1.1 : 1 }}
                  >
                    <Search size={20} />
                  </motion.div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search recipes by name, description, or tags..."
                    className="w-full py-4 px-12 rounded-xl focus:outline-none"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchTerm("")}
                    >
                      <X size={20} />
                    </button>
                  )}
                </motion.div>

                <motion.button
                  className={`px-6 py-4 rounded-xl flex items-center gap-2 ${
                    showFilters ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${activeFiltersCount > 0 && !showFilters ? "border-2 border-orange-500" : ""}`}
                  onClick={() => setShowFilters(!showFilters)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sliders size={20} />
                  <span className="font-medium">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                  {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </motion.button>
              </div>

              <div className="flex gap-2 overflow-x-auto py-2 items-center mb-4">
                <Filter size={20} className="text-gray-400 ml-1 hidden md:block" />
                <div className="flex gap-2 flex-wrap">
                  {filterCategories.map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setActiveFilter(category)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        activeFilter === category
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                          : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-200 pt-6 mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <Award size={18} className="text-orange-500" />
                          Difficulty
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {difficultyOptions.map((difficulty) => (
                            <motion.button
                              key={difficulty}
                              onClick={() => toggleDifficultyFilter(difficulty)}
                              className={`px-3 py-1.5 rounded-full text-sm ${
                                filters.difficulty.includes(difficulty)
                                  ? "bg-orange-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {difficulty}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <Timer size={18} className="text-orange-500" />
                          Cooking Time
                        </h3>
                        <div className="flex flex-col gap-2">
                          {cookTimeOptions.map((option) => (
                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="cookTime"
                                checked={filters.cookTime === option.value}
                                onChange={() => setFilters({ ...filters, cookTime: option.value })}
                                className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                          {filters.cookTime && (
                            <button
                              onClick={() => setFilters({ ...filters, cookTime: null })}
                              className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1 mt-1"
                            >
                              <X size={14} />
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <Users size={18} className="text-orange-500" />
                          Servings
                        </h3>
                        <div className="flex flex-col gap-2">
                          {servingsOptions.map((option) => (
                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="servings"
                                checked={filters.servings === option.value}
                                onChange={() => setFilters({ ...filters, servings: option.value })}
                                className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                          {filters.servings && (
                            <button
                              onClick={() => setFilters({ ...filters, servings: null })}
                              className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1 mt-1"
                            >
                              <X size={14} />
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="font-medium mb-2">Sort Recipes</h3>
                          <div className="flex flex-wrap gap-2">
                            {sortOptions.map((option) => (
                              <motion.button
                                key={option.value}
                                onClick={() => setSortBy(option.value)}
                                className={`px-3 py-1.5 rounded-full text-sm ${
                                  sortBy === option.value
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {option.label}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {activeFiltersCount > 0 && (
                          <motion.button
                            onClick={resetFilters}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X size={18} />
                            <span>Reset All Filters</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="relative w-20 h-20"
              >
                <div className="absolute inset-0 rounded-full border-t-4 border-orange-500 opacity-25"></div>
                <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-orange-500"></div>
              </motion.div>
            </div>
          ) : (
            <>
              {filteredRecipes.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">
                      Showing <span className="font-medium">{filteredRecipes.length}</span> recipes
                      {activeFiltersCount > 0 ? " with applied filters" : ""}
                    </p>
                  </div>
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
                    <AnimatePresence>
                      {filteredRecipes.map((recipe, index) => (
                        <motion.div
                          key={recipe.id}
                          variants={{
                            hidden: { opacity: 0, y: 50 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                          }}
                          exit={{ opacity: 0, y: -50 }}
                          className="h-full"
                        >
                          <RecipeCard recipe={recipe} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  className="text-center py-20 bg-white rounded-2xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-5xl text-gray-300 mb-6">😕</div>
                  <h3 className="text-2xl font-medium mb-3 text-gray-800">No recipes found</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <motion.button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reset Filters
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default Home
