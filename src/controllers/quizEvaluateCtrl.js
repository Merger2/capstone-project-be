const asyncHandler = require("express-async-handler");
const Quiz = require("../models/quizModel");
const UserAnswer = require("../models/userAnswerModel");
const User = require("../models/userModel");

const evaluateQuiz = asyncHandler(async (req, res) => {
  const { quizId, answers } = req.body;

  if (!quizId || !answers || answers.length === 0) {
    return res.status(400).json({
      status: false,
      message: "Quiz ID and answers are required",
    });
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return res.status(404).json({
      status: false,
      message: "Quiz not found",
    });
  }

  let score = 0;
  quiz.questions.forEach((question, index) => {
    if (question.correctAnswer === answers[index]) {
      score++;
    }
  });

  const userAnswer = await UserAnswer.create({
    user: req.user._id,
    quiz: quizId,
    answers,
    score,
  });

  res.status(200).json({
    status: true,
    message: "Quiz evaluated and answer saved",
    score,
    data: userAnswer,
  });
});

const getUserAnswerHistory = asyncHandler(async (req, res) => {
  const userAnswers = await UserAnswer.find({ user: req.user._id })
    .populate("quiz", "title")
    .populate("user", "firstname lastname email");

  res.status(200).json({
    status: true,
    message: "User answer history fetched successfully",
    data: userAnswers,
  });
});

const getUserStats = asyncHandler(async (req, res) => {
  const totalQuizzes = await UserAnswer.countDocuments({ user: req.user._id });

  const averageScore = await UserAnswer.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: null, avgScore: { $avg: "$score" } } },
  ]);

  res.status(200).json({
    status: true,
    message: "User statistics fetched successfully",
    data: {
      totalQuizzes,
      averageScore: averageScore[0]?.avgScore || 0,
    },
  });
});

const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await UserAnswer.aggregate([
    {
      $group: {
        _id: "$user",
        totalScore: { $sum: "$score" },
        quizzesAttempted: { $sum: 1 },
      },
    },
    { $sort: { totalScore: -1 } },
    { $limit: 10 },
  ]);

  const leaderboardWithUser = await Promise.all(
    leaderboard.map(async (entry) => {
      const user = await User.findById(entry._id, "firstname lastname email");
      return { ...entry, user };
    })
  );

  res.status(200).json({
    status: true,
    message: "Leaderboard fetched successfully",
    data: leaderboardWithUser,
  });
});

module.exports = {
  evaluateQuiz,
  getUserAnswerHistory,
  getUserStats,
  getLeaderboard,
};
