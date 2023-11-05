const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
//create course handler
exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, category } =
      req.body;

    //thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetials = await findById(userId);
    console.log(instructorDetials);

    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor details not found",
      });
    }
    const categoryDetails = await Tag.findById(tag);
    if (!categoryDetails) {
      return res.status(400).json({
        success: false,
        message: "Tag details not found",
      });
    }

    //upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create entry for the new course
    const newCourse = await Course.create({
      courseName: courseName,
      courseDescription: courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price: price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    //adding the new course in the user schema of the instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // update the tag schema
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      { $push: { course: newCourse._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create course",
    });
  }
};

//get all courses handler
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
        whatYouWillLearn: true,
        price: true,
        thumbnail: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "All courses retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to get all courses",
    });
  }
};

//get all the courses details
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    //find course details
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate({
        path: "courseContent",
        populate: {
          path:"subSection"
        }
      })
      .populate("ratingAndReviews")
      .populate("category")
      .exec();

      //validation
      if(!courseDetails){
          return res.status(400).json({
              success:false,
              message:`Course details not found with ${courseId}`
          })
      }

      return res.status(200).json({
          success:true,
          message:"Course details fetched successfully",
          data:courseDetails
      })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to all the details related to the course",
    });
  }
};
