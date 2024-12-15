const asyncHandler = require("express-async-handler");
const NewsLetter = require("../models/newsLetterModel");

const subscribe = asyncHandler(async (req, res) => {
  try {
    const newEmail = await NewsLetter.create(req.body);
    res.status(200).json({
      status: true,
      message: "subscribed To NewsLetter",
      newEmail,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const unsubscribe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const newEmail = await NewsLetter.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "Unsubscribed To NewsLetter",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllSUbscriber = asyncHandler(async (req, res) => {
    try {
      const allSubscriber = await NewsLetter.find();
      res.status(200).json({
        status: true,
        message: "Tutorial Category fetched",
        allSubscriber,
      });
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = { subscribe, unsubscribe, getAllSUbscriber };
