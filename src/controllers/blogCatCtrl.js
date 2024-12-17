const { default: slugify } = require("slugify");
const BlogCat = require("../models/blogCatModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../CONFIG/validateMongoDbId");

const postBlogCat = asyncHandler(async (req, res) => {
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
    const postBlogCat = await BlogCat.create(req.body);

    res.status(201).json({
      status: true,
      message: "Blog Category Created Successfully",
      data: postBlogCat,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message:
        error.message || "An error occurred while creating the Blog category",
    });
  }
});

const getAllBlogCat = asyncHandler(async (req, res) => {
  try {
    const allBlogCat = await BlogCat.find();
    res.status(200).json({
      status: true,
      message: "Blog Found!",
      allBlogCat,
    });
  } catch (error) {
    console.error("Error fetching BlogCat:", error.message);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
});

const getABlogCat = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  try {
    const findBlogCat = await BlogCat.findOne({ title: slug });

    if (!findBlogCat) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Category Found",
      findBlogCat,
    });
  } catch (error) {
    next(error);
  }
});

const deleteABlogCat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteBlogCat = await BlogCat.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "Blog Category Deleted",
      deleteBlogCat,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateABlogCat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
    }
    const updateBlogCat = await BlogCat.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: true,
      message: "Blog Category Update",
      updateBlogCat,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  postBlogCat,
  getABlogCat,
  getAllBlogCat,
  updateABlogCat,
  deleteABlogCat,
};
