const Profile = require("../models/Profile");
const User = require("../models/User");
const {
  updateImageToCloudinary,
  uploadImageToCloudinary,
} = require("../utils/imageUploader");
require("dotenv").config();

exports.updateProfile = async (req, res) => {
  try {
    //get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    //get user id
    const id = req.user.id;

    //validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    //find user
    const userDetails = await User.findById(id);

    //find profile
    const profileDetails = await Profile.findById(
      userDetails.additionalDetails
    );

    //update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    //response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
    });
  } catch (errror) {
    return res.status(500).json({
      success: false,
      message: "Error in updating profile",
    });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    //get the profile id
    const id = req.user.id;

    //validation of id
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    //delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    //delete user
    await User.findByIdAndDelete({ _id: id });
    //return response
    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in deleting profile",
    });
  }
};

//get all user details
exports.getAllUserDetails = async (req, res) => {
  try {
    const { userId } = req.user.id;
    const userDetails = await User.findById({ _id: userId })
      .populate("additioanlDetails")
      .exec();
    console.log(userDetails);

    return res.status(200).json({
      success: true,
      message: "All the details of the user fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to get all the user details",
    });
  }
};

//update display picture
exports.updateDispalyPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      {
        image: image.secure_url,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Displpay image updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update the display picture",
    });
  }
};

//get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.user;

    const userDetails = await User.findById({ _id: userId })
      .populate("courses")
      .exec();

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Unable to get the user details",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched enrolled courses successfully",
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch the enrolled courses",
      error: error,
    });
  }
};
