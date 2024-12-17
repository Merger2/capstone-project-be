const { createQuiz, getAllQuizzes, getQuizzesByFilter, deleteQuiz } = require("../controllers/quzCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const quizRouter = require("express").Router();

quizRouter.post("/create", authMiddleware, isAdmin, createQuiz);
quizRouter.get("/", getAllQuizzes);
quizRouter.get("/filter/:categorySlug/:levelSlug/:schoolTypeSlug", getQuizzesByFilter);
quizRouter.delete("/:id", authMiddleware, isAdmin, deleteQuiz);



module.exports = quizRouter;
