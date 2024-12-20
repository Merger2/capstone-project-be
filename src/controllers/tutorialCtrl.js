const { default: slugify } = require("slugify");
const Tutorial = require("../models/tutorialModel");
const asyncHandler = require("express-async-handler");

const postTutorial = asyncHandler(async (req, res) => {
  try {
    // Membuat slug dari title dan tutorialCategory
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
    }
    if (req.body.tutorialCategory) {
      req.body.tutorialCategorySlug = slugify(req.body.tutorialCategory.toLowerCase());
    }

    // Memastikan file gambar diunggah
    if (!req.file) {
      return res.status(422).json({ message: "Image must be uploaded" });
    }
    req.body.image = req.file.path;

    // Membuat tutorial baru dalam database
    const postTut = await Tutorial.create(req.body);

    res.status(201).json({
      status: true,
      message: "Tutorial Created",
      data: postTut,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Something went wrong",
      error: error.message,
    });
  }
});



const getATutorial = asyncHandler(async (req, res) => {
  const { slug, type } = req.params;
  try {
    const getATutData = await Tutorial.findOne({
      slug: slug,
      tutorialCategorySlug: type,
    });
    if (!getATutData) {
      return res.status(404).json({
        status: false,
        message: "Tutorial not found",
      });
    }
    const tutorialTopics = await Tutorial.find({ tutorialCategorySlug: type })
      .select("TopicName title slug tutorialCategorySlug")
      .sort("createdAt");

    res.status(200).json({
      status: true,
      message: "Data Fetched",
      getATutData,
      tutorialTopics,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

const updateTutorial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
    }
    if (req.body.tutorialCategory) {
      req.body.tutorialCategorySlug = slugify(
        req.body.tutorialCategory.toLowerCase()
      );
    }

    const updateTut = await Tutorial.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updateTut) {
      return res.status(404).json({
        status: false,
        message: "Tutorial not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Tutorial Updated",
      data: updateTut,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

const deleteTutorial = asyncHandler(async (req, res) => {
  const { id } = req.params; // Perbaiki dari req.param menjadi req.params
  try {
    const deleteTut = await Tutorial.findByIdAndDelete(id);
    if (!deleteTut) {
      return res.status(404).json({
        status: false,
        message: "Tutorial not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Tutorial Deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

const getAllTutorials = asyncHandler(async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Tutorials Fetched",
      data: tutorials,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = {
  postTutorial,
  getATutorial,
  updateTutorial,
  deleteTutorial,
  getAllTutorials,
};
