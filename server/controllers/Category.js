const Category = require("../models/Category");

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
    const newCategory = await Category.create({
      name: name,
      description: description,
    });
    console.log(newCategory);

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Problem in creating category",
      error: error.message,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({},{name:true,description:true});
    res.status(200).json({
        status: true,
        message: "All categories retrieved successfully",
    })
    console.log(allCategories);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Problem in fetching categories",
      error: error.message,
    });
  }
};
