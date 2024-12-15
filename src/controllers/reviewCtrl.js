const validateMongodbId = require("../CONFIG/validateMongoDbId");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const createReview = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    let data = { user: _id, comment: req.body.comment, color: req.body.color };
    const review = await Review.create(data);
    res.status(200).json({
      status: true,
      message: "Riview Added",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllReviews = asyncHandler(async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({
      status: true,
      message: "Reviews Fetched Successfully",
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error: ${error.message}`,
    });
  }
});

const getAReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id).populate("user");
    if (!review) {
      return res.status(404).json({
        status: false,
        message: "Review not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Review Fetched Successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error: ${error.message}`,
    });
  }
});

const deleteAReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({
        status: false,
        message: "Review not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Review Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error: ${error.message}`,
    });
  }
});

const updateAReviewStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved: req.body.isApproved },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({
        status: false,
        message: "Review not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Review Status Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error: ${error.message}`,
    });
  }
});

module.exports = { createReview, getAllReviews, getAReview, deleteAReview, updateAReviewStatus };