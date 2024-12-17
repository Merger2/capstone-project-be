const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

let blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    category:{
      type:String,
      required:true,
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
    keywords: {
      type: [],
      required: true,
    },
  },
  { timestamps: true }
);
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title.toLowerCase());
  }
  next();
});
module.exports = mongoose.model("Blog", blogSchema);
