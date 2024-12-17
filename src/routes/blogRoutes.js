const {
  postBlog,
  getBlog,
  getAllBlog,
  deleteBlog,
  updateBlog,
} = require("../controllers/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const blogRouter = require("express").Router();

blogRouter.post("/", authMiddleware, isAdmin, postBlog);
blogRouter.get("/:slug", getBlog);
blogRouter.get("/", getAllBlog);
blogRouter.delete("/:id", authMiddleware, isAdmin, deleteBlog);
blogRouter.put("/:id", authMiddleware, isAdmin, updateBlog);

module.exports = blogRouter;
