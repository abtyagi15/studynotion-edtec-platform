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
const { createSubSection } = require("../controllers/SubSection");

//importing rating and review controller
const {
  createRating,
  getAllRating,
  getAverageRating,
} = require("../controllers/RatingAndReview");

//........................course routes.....................................//

router.put("/create-course", auth, isInstructor, createCourse);
router.get("/get-all-courses", auth, isInstructor, getAllCourses);
router.get("/get-course-details", auth, isInstructor, getCourseDetails);
