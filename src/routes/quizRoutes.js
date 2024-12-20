const {
  evaluateQuiz,
  getUserAnswerHistory,
  getUserStats,
  getLeaderboard,
} = require("../controllers/quizEvaluateCtrl");
const {
  createQuiz,
  getAllQuizzes,
  getQuizzesByFilter,
  deleteQuiz,
} = require("../controllers/quzCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const quizRouter = require("express").Router();

quizRouter.post("/create", authMiddleware, isAdmin, createQuiz);
quizRouter.get("/", getAllQuizzes);
quizRouter.get(
  "/filter/:categorySlug/:levelSlug/:schoolTypeSlug",
  getQuizzesByFilter
);
quizRouter.delete("/:id", authMiddleware, isAdmin, deleteQuiz);
quizRouter.post("/evaluate", authMiddleware, evaluateQuiz);
quizRouter.get("/history", authMiddleware, getUserAnswerHistory);
quizRouter.get("/stats/:id", authMiddleware, getUserStats);
quizRouter.get("/leaderboard", authMiddleware, isAdmin, getLeaderboard);
quizRouter.put("/:id")

module.exports = quizRouter;
