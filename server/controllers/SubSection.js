const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;

    //extract video/file
    const video = req.files.videoFile;

    //validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    //create subsection
    const subsection = await SubSection.create({
      title: title,
      description: description,
      timeDuration: timeDuration,
      videoUrl: uploadDetails.secure_url,
    });

    //update section with subsectionid
    const updateSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: { subSection: subsection._id },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Subsection created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in creating subsection",
    });
  }
};

//update subsection
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, description } = req.body;

    const subSectionDetails = await SubSection.findById(subSectionId);

    //validation
    if (!subSectionDetails) {
      return res.status(400).json({
        success: false,
        message: "No subsection with this id",
      });
    }

    if (title !== undefined) {
      subSectionDetails.title = title;
    }
    if (description !== undefined) {
      subSectionDetails.description = description;
    }

    if ((req.files && req, files.video !== undefined)) {
      const video = req.files.videoFile;

      const uploadVideo = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );

      subSectionDetails.videoUrl = uploadVideo.secure_url;
      subSectionDetails.timeDuration = `${uploadVideo.duration}`;
    }
    //saving updated details in database
    await subSectionDetails.save();

    return res.status(200).json({
      success: true,
      message: "Subsection updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in updating subsection",
    });
  }
};

//delete subsection
exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body;

      const subSectionDetails = await SubSection.findById(subSectionId);

      //validation
      if (!subSectionDetails) {
        return res.status(400).json({
          success: false,
          message: "No subsection with this id",
        });
      }

      await SubSection.findByIdAndDelete(subSectionId);

      //remove deleted subsection id  from section model
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: { subSection: subSectionId },
        }
      );

      return res.status(200).json({
        success: true,
        message: "Subsection deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error in deleting subsection",
      });
    }
  };
