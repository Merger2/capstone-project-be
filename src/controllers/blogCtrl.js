const { default: slugify } = require("slugify");
const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../CONFIG/validateMongoDbId");

const postBlog = asyncHandler(async (req, res) => {
    try {
      const { title } = req.body;
  
      if (!title) {
        return res.status(400).json({
          status: false,
          message: "Title is required",
        });
      }
  
      // Membuat slug dari title
      let slug = slugify(title.toLowerCase());
  
      // Cek apakah slug sudah ada di database
      const existingSlug = await Blog.findOne({ slug });
      if (existingSlug) {
        return res.status(400).json({
          status: false,
          message: "Slug already exists, please use a different title",
        });
      }
  
      // Menyimpan slug yang unik dalam body request
      req.body.slug = slug;
  
      // Membuat blog baru
      const postBlog = await Blog.create(req.body);
  
      res.status(201).json({
        status: true,
        message: "Blog Category Created Successfully",
        data: postBlog,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message:
          error.message || "An error occurred while creating the Blog category",
      });
    }
  });
  

const getBlog = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const blog = await Blog.findOne({ slug: slug });
    if(!blog) {
        return res.status(404).json({
            status:false,
            message:"Blog Not Found",
        })
    }
    res.status(200).json({
      status: true,
      message: "Blog Found!",
      blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.find();
    res.status(200).json({
      status: true,
      message: "Blogs Found!",
      blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const blog = await Blog.findByIdAndDelete(id);
      if (!blog) {
        return res.status(404).json({
          status: false,
          message: "Blog not found",
        });
      }
      res.status(200).json({
        status: true,
        message: "Blog Deleted!",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message || "An error occurred while deleting the blog",
      });
    }
  });
  

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
    }
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      status: true,
      message: "Blog Updated Successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { postBlog, getBlog, getAllBlog, deleteBlog, updateBlog };
