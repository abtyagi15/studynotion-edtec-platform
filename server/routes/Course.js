const express = require("express");
const router = express.Router();

//importing middleware
const { auth, isStudent, isInstructor } = require("../middlewares/auth");

//importing course controllers
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controllers/Course");
const {
  createCategory,
  getAllCategories,
  categoryPageDetails,
} = require("../controllers/Category");

//importing section controllers
const {
  creatSection,
  deleteSection,
  updateSection,
} = require("../controllers/Section");

//importing subsection controller
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");

//importing rating and review controller
const {
  createRating,
  getAllRating,
  getAverageRating,
} = require("../controllers/RatingAndReview");

//........................course routes.....................................//

// Courses can Only be Created by Instructors
router.post("/create-course", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/add-section", auth, isInstructor, createSection)
// Update a Section
router.post("/update-section", auth, isInstructor, updateSection)
// Delete a Section
router.post("/delete-section", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/update-subsection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/delete-subsection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/add-subsection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/get-all-courses", getAllCourses)
// Get Details for a Specific Courses
router.post("/get-course-details", getCourseDetails)



//........................category routes.....................................//
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/create-category", auth, isAdmin, createCategory)
router.get("/show-all-categories", showAllCategories)
router.post("/get-category-page-details", categoryPageDetails)

//........................Rating and Review routes.....................................//

router.post("/create-rating-and-reviews", auth, isStudent, createRating)
router.get("/get-avg-rating-review", getAverageRating)
router.get("/get-all-rating-and-reviews", getAllRatingReview)

module.exports = router