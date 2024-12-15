const {
  createReview,
  getAllReviews,
  getAReview,
  deleteAReview,
  updateAReviewStatus,
} = require("../controllers/reviewCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const reviewRouter = require("express").Router();

reviewRouter.post("/", authMiddleware, createReview);
reviewRouter.get("/:id", authMiddleware, isAdmin, getAReview);
reviewRouter.get("/", getAllReviews);
reviewRouter.delete("/:id", authMiddleware, isAdmin, deleteAReview);
reviewRouter.put("/:id", authMiddleware, isAdmin, updateAReviewStatus);

module.exports = reviewRouter;
