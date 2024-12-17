const mongoose = require("mongoose");

let videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default:
        "https://bpshire.com/wp-content/uploads/2017/06/wood-blog-placeholder.jpg",
    },
    description: {
      type: String,
      required: true,
    },
    video_url: {
      type: String,
      required: true,
    },
    keywords: {
      type: [],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
