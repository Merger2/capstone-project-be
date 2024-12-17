const { default: slugify } = require("slugify");
const DocCat = require("../models/docCatModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../CONFIG/validateMongoDbId");

const postDocCat = asyncHandler(async (req, res) => {
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
    const postDocCat = await DocCat.create(req.body);

    res.status(201).json({
      status: true,
      message: "Doc Category Created Successfully",
      data: postDocCat,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message:
        error.message || "An error occurred while creating the Doc category",
    });
  }
});

const allDocument = asyncHandler(async (req, res) => {
  try {
    const allDocCat = await DocCat.find();
    res.status(200).json({
      status: true,
      message: "Doc Found!",
      allDocCat,
    });
  } catch (error) {
    console.error("Error fetching DocCat:", error.message);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
});

const getADocCat = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  try {
    const findDocCat = await DocCat.findOne({ title: slug });

    if (!findDocCat) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Category Found",
      findDocCat,
    });
  } catch (error) {
    next(error);
  }
});

const deleteADocCat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteDocCat = await DocCat.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "Doc Category Deleted",
      deleteDocCat,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateADocCat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
    }
    const updateDocCat = await DocCat.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: true,
      message: "Doc Category Update",
      updateDocCat,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  postDocCat,
  getADocCat,
  allDocument,
  updateADocCat,
  deleteADocCat,
};
