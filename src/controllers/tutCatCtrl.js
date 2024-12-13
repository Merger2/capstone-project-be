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
      message: "Tutorial Category fetched",
      allTutCat,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getATutCat = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  
  try {
    const findTutCat = await TutorialCategory.findById(id);
    
    if (!findTutCat) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }
    
    res.status(200).json({
      status: true,
      message: "Category Found",
      findTutCat,
    });
  } catch (error) {
    next(error);
  }
});


const deleteATutCat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteTutCat = await TutorialCategory.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "Tutorial Category Deleted",
      deleteTutCat,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateATutCat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
    }
    const updateTutCat = await TutorialCategory.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      status: true,
      message: "Tutorial Category Update",
      updateTutCat,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  postTutorialCategory,
  getATutCat,
  getAllTutCategories,
  updateATutCat,
  deleteATutCat,
};
