import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik"
import * as Yup from "yup"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  Plus,
  Minus,
  Tag,
  Award,
  ChefHat,
  BookOpen,
  Users,
  Save,
  Loader,
  X,
  ImageIcon,
  Upload,
  Trash2,
  AlertCircle,
} from "lucide-react"

const RecipeForm = ({ initialValues = null, isEditing = false }) => {
  const navigate = useNavigate()
  const [tagInput, setTagInput] = useState("")
  const [imagePreview, setImagePreview] = useState(null)

  const RecipeSchema = Yup.object().shape({
    title: Yup.string().min(3, "Title is too short!").max(100, "Title is too long!").required("Title is required"),
    description: Yup.string()
      .min(10, "Description is too short!")
      .max(500, "Description is too long!")
      .required("Description is required"),
    category: Yup.string().required("Category is required"),
    difficulty: Yup.string().required("Difficulty is required"),
    prepTime: Yup.number().min(0, "Prep time cannot be negative").required("Prep time is required"),
    cookTime: Yup.number().min(0, "Cook time cannot be negative").required("Cook time is required"),
    servings: Yup.number()
      .min(1, "Must have at least 1 serving")
      .max(50, "Maximum 50 servings")
      .required("Servings is required"),
    ingredients: Yup.array()
      .of(Yup.string().required("Ingredient cannot be empty"))
      .min(1, "Add at least one ingredient")
      .required("Ingredients are required"),
    instructions: Yup.array()
      .of(Yup.string().required("Instruction cannot be empty"))
      .min(1, "Add at least one instruction")
      .required("Instructions are required"),
    tags: Yup.array().of(Yup.string()),
    image: Yup.string(),
  })

  const defaultValues = {
    title: "",
    description: "",
    image: "/placeholder.svg?height=300&width=500&text=Recipe+Image",
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    ingredients: [""],
    instructions: [""],
    category: "",
    tags: [],
  }

  const formInitialValues = initialValues || defaultValues

  useEffect(() => {
    if (initialValues?.image) {
      setImagePreview(initialValues.image)
    }
  }, [initialValues])

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

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFieldValue("image", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  return (
    <Formik initialValues={formInitialValues} validationSchema={RecipeSchema}>
      {({ values, errors, touched, isSubmitting, setFieldValue }) => (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Form className="space-y-8">
            <motion.div variants={itemVariants}>
              <div className="mb-8">
                <label className="block font-medium mb-3 text-lg flex items-center">
                  <ImageIcon size={20} className="mr-2 text-orange-500" />
                  Recipe Image
                </label>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-1/3">
                    <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-video shadow-md">
                      {imagePreview ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full"
                        >
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Recipe preview"
                            className="w-full h-full object-cover"
                          />
                          <motion.button
                            type="button"
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setImagePreview(null)
                              setFieldValue("image", "/placeholder.svg?height=300&width=500&text=Recipe+Image")
                            }}
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </motion.div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-6">
                          <ImageIcon size={48} className="mb-2" />
                          <p className="text-center text-sm">No image selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Upload size={36} className="text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-4 text-center">
                        Drag and drop an image here, or click to select a file
                      </p>
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, setFieldValue)}
                      />
                      <motion.label
                        htmlFor="image-upload"
                        className="btn-primary cursor-pointer flex items-center gap-2 py-3 px-6 rounded-full"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ImageIcon size={18} />
                        <span>Select Image</span>
                      </motion.label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: JPG, PNG or GIF with minimum dimensions of 800x600px
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
              <div>
                <label htmlFor="title" className="block font-medium mb-2 flex items-center">
                  <BookOpen size={18} className="mr-2 text-orange-500" />
                  Recipe Title
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Delicious Pasta Carbonara"
                  className={`input-field py-3 px-4 rounded-xl text-lg ${
                    errors.title && touched.title ? "border-red-500 bg-red-50" : ""
                  }`}
                />
                <ErrorMessage name="title">
                  {(msg) => (
                    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                      <AlertCircle size={14} />
                      <span>{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div>
                <label htmlFor="category" className="block font-medium mb-2 flex items-center">
                  <BookOpen size={18} className="mr-2 text-orange-500" />
                  Category
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className={`input-field py-3 px-4 rounded-xl appearance-none pr-10 ${
                      errors.category && touched.category ? "border-red-500 bg-red-50" : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Main Dish">Main Dish</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Soup">Soup</option>
                    <option value="Salad">Salad</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Snack">Snack</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Drink">Drink</option>
                  </Field>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <ErrorMessage name="category">
                  {(msg) => (
                    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                      <AlertCircle size={14} />
                      <span>{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block font-medium mb-2 flex items-center">
                  <BookOpen size={18} className="mr-2 text-orange-500" />
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="A brief description of your recipe..."
                  className={`input-field min-h-[120px] rounded-xl py-3 px-4 ${
                    errors.description && touched.description ? "border-red-500 bg-red-50" : ""
                  }`}
                />
                <ErrorMessage name="description">
                  {(msg) => (
                    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                      <AlertCircle size={14} />
                      <span>{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div>
                <label htmlFor="difficulty" className="block font-medium mb-2 flex items-center">
                  <Award size={18} className="mr-2 text-orange-500" />
                  Difficulty
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    id="difficulty"
                    name="difficulty"
                    className={`input-field py-3 px-4 rounded-xl appearance-none pr-10 ${
                      errors.difficulty && touched.difficulty ? "border-red-500 bg-red-50" : ""
                    }`}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </Field>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <ErrorMessage name="difficulty">
                  {(msg) => (
                    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                      <AlertCircle size={14} />
                      <span>{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="prepTime" className="block font-medium mb-2 flex items-center">
                    <Clock size={18} className="mr-2 text-orange-500" />
                    Prep Time (min)
                  </label>
                  <Field
                    type="number"
                    id="prepTime"
                    name="prepTime"
                    min="0"
                    className={`input-field py-3 px-4 rounded-xl ${
                      errors.prepTime && touched.prepTime ? "border-red-500 bg-red-50" : ""
                    }`}
                  />
                  <ErrorMessage name="prepTime">
                    {(msg) => (
                      <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                        <AlertCircle size={14} />
                        <span>{msg}</span>
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div>
                  <label htmlFor="cookTime" className="block font-medium mb-2 flex items-center">
                    <ChefHat size={18} className="mr-2 text-orange-500" />
                    Cook Time (min)
                  </label>
                  <Field
                    type="number"
                    id="cookTime"
                    name="cookTime"
                    min="0"
                    className={`input-field py-3 px-4 rounded-xl ${
                      errors.cookTime && touched.cookTime ? "border-red-500 bg-red-50" : ""
                    }`}
                  />
                  <ErrorMessage name="cookTime">
                    {(msg) => (
                      <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                        <AlertCircle size={14} />
                        <span>{msg}</span>
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div>
                  <label htmlFor="servings" className="block font-medium mb-2 flex items-center">
                    <Users size={18} className="mr-2 text-orange-500" />
                    Servings
                  </label>
                  <Field
                    type="number"
                    id="servings"
                    name="servings"
                    min="1"
                    className={`input-field py-3 px-4 rounded-xl ${
                      errors.servings && touched.servings ? "border-red-500 bg-red-50" : ""
                    }`}
                  />
                  <ErrorMessage name="servings">
                    {(msg) => (
                      <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                        <AlertCircle size={14} />
                        <span>{msg}</span>
                      </div>
                    )}
                  </ErrorMessage>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center">
                  <ChefHat size={20} className="mr-2 text-orange-500" />
                  Ingredients
                </h3>
                <motion.button
                  type="button"
                  onClick={() => setFieldValue("ingredients", [...values.ingredients, ""])}
                  className="bg-orange-100 text-orange-600 hover:bg-orange-200 py-2 px-4 rounded-full flex items-center gap-1 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={18} />
                  <span>Add Ingredient</span>
                </motion.button>
              </div>

              <FieldArray name="ingredients">
                {({ remove, push }) => (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {values.ingredients.map((ingredient, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-2"
                        >
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <motion.div
                                className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                {index + 1}
                              </motion.div>
                            </div>
                            <Field
                              name={`ingredients.${index}`}
                              placeholder={`Ingredient ${index + 1}`}
                              className={`input-field py-3 px-4 rounded-xl w-full ${
                                errors.ingredients?.[index] && touched.ingredients?.[index]
                                  ? "border-red-500 bg-red-50"
                                  : ""
                              }`}
                            />
                            {errors.ingredients?.[index] && touched.ingredients?.[index] && (
                              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                                <AlertCircle size={14} />
                                <span>{errors.ingredients[index]}</span>
                              </div>
                            )}
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => remove(index)}
                            className="px-3 py-3 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 flex items-center justify-center h-fit mt-7"
                            disabled={values.ingredients.length <= 1}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus size={18} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {errors.ingredients && typeof errors.ingredients === "string" && (
                      <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                        <AlertCircle size={14} />
                        <span>{errors.ingredients}</span>
                      </div>
                    )}
                  </div>
                )}
              </FieldArray>
            </motion.div>

            {/* Instructions */}
            <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center">
                  <BookOpen size={20} className="mr-2 text-orange-500" />
                  Instructions
                </h3>
                <motion.button
                  type="button"
                  onClick={() => setFieldValue("instructions", [...values.instructions, ""])}
                  className="bg-orange-100 text-orange-600 hover:bg-orange-200 py-2 px-4 rounded-full flex items-center gap-1 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={18} />
                  <span>Add Step</span>
                </motion.button>
              </div>

              <FieldArray name="instructions">
                {({ remove }) => (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {values.instructions.map((instruction, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-3"
                        >
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                              <motion.div
                                className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                {index + 1}
                              </motion.div>
                              <span className="font-medium">Step {index + 1}</span>
                            </div>
                            <Field
                              as="textarea"
                              name={`instructions.${index}`}
                              placeholder={`Describe step ${index + 1}...`}
                              className={`input-field w-full min-h-[100px] rounded-xl py-3 px-4 ${
                                errors.instructions?.[index] && touched.instructions?.[index]
                                  ? "border-red-500 bg-red-50"
                                  : ""
                              }`}
                            />
                            {errors.instructions?.[index] && touched.instructions?.[index] && (
                              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                                <AlertCircle size={14} />
                                <span>{errors.instructions[index]}</span>
                              </div>
                            )}
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => remove(index)}
                            className="px-3 py-3 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 h-fit flex items-center justify-center mt-10"
                            disabled={values.instructions.length <= 1}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus size={18} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {errors.instructions && typeof errors.instructions === "string" && (
                      <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                        <AlertCircle size={14} />
                        <span>{errors.instructions}</span>
                      </div>
                    )}
                  </div>
                )}
              </FieldArray>
            </motion.div>

            {/* Tags */}
            <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold text-lg flex items-center">
                  <Tag size={20} className="mr-2 text-orange-500" />
                  Tags
                </h3>
                <span className="text-sm text-gray-500">(Optional)</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <AnimatePresence>
                  {values.tags.map((tag, index) => (
                    <motion.div
                      key={tag}
                      className="bg-orange-100 px-3 py-1.5 rounded-full flex items-center gap-1.5"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-orange-700">{tag}</span>
                      <motion.button
                        type="button"
                        onClick={() => {
                          const newTags = [...values.tags]
                          newTags.splice(index, 1)
                          setFieldValue("tags", newTags)
                        }}
                        className="w-5 h-5 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs"
                        whileHover={{ backgroundColor: "#f44336", color: "#ffffff" }}
                      >
                        <X size={12} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag (e.g. 'Vegetarian', 'Spicy')"
                    className="input-field pl-10 py-3 rounded-xl w-full"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        if (tagInput && !values.tags.includes(tagInput)) {
                          setFieldValue("tags", [...values.tags, tagInput])
                          setTagInput("")
                        }
                      }
                    }}
                  />
                </div>
                <motion.button
                  type="button"
                  onClick={() => {
                    if (tagInput && !values.tags.includes(tagInput)) {
                      setFieldValue("tags", [...values.tags, tagInput])
                      setTagInput("")
                    }
                  }}
                  className="btn-secondary py-3 px-5 rounded-xl"
                  disabled={!tagInput}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add
                </motion.button>
              </div>
            </motion.div>

            <motion.div className="flex justify-end pt-4" variants={itemVariants}>
              <motion.button
                type="submit"
                className="btn-primary py-4 px-8 text-lg flex items-center gap-2 rounded-full shadow-lg"
                disabled={isSubmitting}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span>{isEditing ? "Updating Recipe..." : "Creating Recipe..."}</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>{isEditing ? "Update Recipe" : "Create Recipe"}</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </Form>
        </motion.div>
      )}
    </Formik>
  )
}

export default RecipeForm
