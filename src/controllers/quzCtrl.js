const { default: slugify } = require("slugify");
const Quiz = require("../models/quizModel");
const asyncHandler = require("express-async-handler");

const createQuiz = asyncHandler(async (req, res) => {
  try {
    const { title, questions, category, level, schoolType } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Title and questions are required",
      });
    }

    const newQuiz = await Quiz.create({
      title,
      category: slugify(category, { lower: true }),  // slugify category
      level: slugify(level, { lower: true }),        // slugify level
      schoolType: slugify(schoolType, { lower: true }), // slugify schoolType
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: true,
      message: "Quiz created successfully",
      data: newQuiz,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "An error occurred while creating the quiz",
    });
  }
});

const getAllQuizzes = asyncHandler(async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    if (quizzes.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No quizzes found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Quizzes found",
      data: quizzes,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "An error occurred while fetching quizzes",
    });
  }
});


const getQuizzesByFilter = asyncHandler(async (req, res) => {
    const { categorySlug, levelSlug, schoolTypeSlug } = req.params;
    const categorySlugified = slugify(categorySlug, { lower: true });
    const levelSlugified = slugify(levelSlug, { lower: true });
    const schoolTypeSlugified = slugify(schoolTypeSlug, { lower: true });
  
    try {
      const quizzes = await Quiz.find({
        category: categorySlugified,
        level: levelSlugified,
        schoolType: schoolTypeSlugified,
      });
  
      if (quizzes.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No quizzes found for the specified filters",
        });
      }
  
      res.status(200).json({
        status: true,
        message: "Quizzes found",
        data: quizzes,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message || "An error occurred while fetching quizzes",
      });
    }
  });
  

const deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findByIdAndDelete(id);

    if (!quiz) {
      return res.status(404).json({
        status: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "An error occurred while deleting the quiz",
    });
  }
});

const updateQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, questions, category, level, schoolType } = req.body;

  // Validate input
  if (!title || !questions || questions.length === 0) {
    return res.status(400).json({
      status: false,
      message: "Title and questions are required",
    });
  }

  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      {
        title,
        category: slugify(category, { lower: true }),
        level: slugify(level, { lower: true }),
        schoolType: slugify(schoolType, { lower: true }),
        questions,
        updatedBy: req.user._id,
      },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({
        status: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Quiz updated successfully",
      data: updatedQuiz,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "An error occurred while updating the quiz",
    });
  }
});


module.exports = { createQuiz, getAllQuizzes, getQuizzesByFilter, deleteQuiz, updateQuiz };
