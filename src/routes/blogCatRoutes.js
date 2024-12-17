const {
  postBlogCat,
  getABlogCat,
  getAllBlogCat,
  updateABlogCat,
  deleteABlogCat,
} = require("../controllers/blogCatCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const blogCatRouter = require("express").Router();

blogCatRouter.post("/", authMiddleware, isAdmin, postBlogCat);

blogCatRouter.get("/", getAllBlogCat);
blogCatRouter.get("/:slug", authMiddleware, isAdmin, getABlogCat);

blogCatRouter.put("/:id", authMiddleware, isAdmin, updateABlogCat);

blogCatRouter.delete("/:id", authMiddleware, isAdmin, deleteABlogCat);

module.exports = blogCatRouter;
