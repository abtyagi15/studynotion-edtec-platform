const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

//create rating
exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, rating, review } = req.body;

    //check if user is enrolled in course
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    //check if user has already rated and reviewed
    const alreadyReviewd = await RatingAndReview.findOne({ user: userId });
    if (!alreadyReviewd) {
      return res.status(400).json({
        success: false,
        message: "You have already rated and reviewed this course",
      });
    }

    //creating the review
    const ratingReview = await RatingAndReview.create(
      {
        user: userId,
        course: courseId,
        rating,
        review,
      },
      { new: true }
    );

    //update this rating in course
    const courseUpdateDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReview: ratingReview._id,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Rating and review created successfully",
      ratingReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in creating rating",
      error: error.message,
    });
  }
};

//get average rating
exports.getAverageRating = async (req, res) => {
  try {
    //get course id
    const courseId = req.body.courseId;

    //calculate avg rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mmongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
        },
      },
    ]);
    if (result > 0) {
      return res.status(200).json({
        success: true,
        message: "Average rating calculated successfully",
        averageRating: result[0].averageRating,
      });
    }

    //no rating and review
    return res.status(200).json({
      success: true,
      message: "Average rating is 0, no rating till now",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getting average rating",
    });
  }
};
//get all rating
exports.getAllRating = async (req, res) => {
  try {
    const allRatingAndReviews = await RatingAndReview.find({}).populate("user").exec(); 

    return res.status(200).json({
      success: true,
      message: "All ratings and reviews retrieved successfully",
      data:allRatingAndReviews,
    });
} catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getting all the ratings and reviews",
    });
  }
};
