const { default: slugify } = require("slugify");
const Doc = require("../models/documentationModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../CONFIG/validateMongoDbId");

const postdoc = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
    }
    const doc = await Doc.create(req.body);
    res.status(200).json({
      status: true,
      message: "Doc Posted Successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getdoc = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const doc = await Doc.findOne({ slug: slug });
    res.status(200).json({
      status: true,
      message: "Doc Found!",
      doc,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAlldoc = asyncHandler(async (req, res) => {
  try {
    const doc = await Doc.find();
    res.status(200).json({
      status: true,
      message: "Docs Found!",
      doc,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deletedoc = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Doc.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "Doc Deleted!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatedoc = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
    }
    const doc = await Doc.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      status: true,
      message: "Doc Updated Successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { postdoc, getdoc, getAlldoc, deletedoc, updatedoc };
