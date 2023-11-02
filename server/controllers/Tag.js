const Tag = require("../models/Tag");

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //creating tag entry in db
    const newTag = await Tag.create({
      name: name,
      description: description,
    });
    console.log(newTag);

    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Problem in creating tag",
      error: error.message,
    });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({},{name:true,description:true});
    res.status(200).json({
        status: true,
        message: "All tags retrieved successfully",
    })
    console.log(allTags);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Problem in fetching tags",
      error: error.message,
    });
  }
};
