const mongoose = require("mongoose");
const slugify = require("slugify");

let tutCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [50, "Title cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    image: {
      type: String,
      default: "https://bpshire.com/wp-content/uploads/2017/06/wood-blog-placeholder.jpg",
      validate: {
        validator: function (v) {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`,
      },
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title
tutCategorySchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title.toLowerCase());
  }
  next();
});

module.exports = mongoose.model("TutorialCategory", tutCategorySchema);
