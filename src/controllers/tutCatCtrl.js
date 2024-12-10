const { default: slugify } = require("slugify");
const TutorialCategory = require("../models/tutCategory");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../CONFIG/validateMongoDbId");

const postTutorialCategory = asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        status: failed,
        message: "Title is required",
      });
    }
    const slug = slugify(title.toLowerCase());
    req.body.slug = slug;
    const postTutCat = await TutorialCategory.create(req.body);

    res.status(201).json({
      status: true,
      message: "Tutorial Category Created Successfully",
      data: postTutCat,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message:
        error.message ||
        "An error occurred while creating the tutorial category",
    });
  }
});

const getAllTutCategories = asyncHandler(async (req, res) => {
  try {
    const allTutCat = await TutorialCategory.find();
    res.status(200).json({
      status: true,
      message: "Tutorial Category fetched Successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getATutCat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findTutCat = await TutorialCategory.findById(id);
    res.status(200).json({
        status: true,
        message: "Category Found",
      });
  } catch (error) {
    throw new Error(error);
  }
});

const deletATutCat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const findTutCat = await TutorialCategory.findByIdAndDelete(id);
  } catch (error) {}
});

module.exports = { postTutorialCategory };
