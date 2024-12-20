  const mongoose = require("mongoose");

  const tutorialSchema = new mongoose.Schema(
    {
      title: {
        required: true,
        unique: true,
        type: String,
      },
      slug: {
        required: true,
        type: String,
        unique: true,
        index: true,
      },
      tutorialCategory: {
        type: String,
        required: true,
      },
      tutorialCategorySlug: {
        type: String,
        required: true,
      },
      topicName: {
        type: String,
        required: true,
      },
      level: {
        type: String,
        required: true,
      },
      schoolType: {
        type: String,
        required: true,
      },
      content: {
        required: true,
        type: String,
      },
      image: {
        type: String,
        required: true,
        default: "https://via.placeholder.com/150?text=No+Image",
      },
      keywords: {
        type: [String],
        required: true,
      },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Tutorial", tutorialSchema);
