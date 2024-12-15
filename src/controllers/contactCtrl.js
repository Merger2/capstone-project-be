const Contact = require("../models/contactModel");
const asyncHandler = require("express-async-handler");

const createContact = asyncHandler(async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(200).json({
      status: true,
      message: "Enquiry Form Submitted Added",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllContacts = asyncHandler(async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({
      status: true,
      message: "Enquiry Fetched Successfully",
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error: ${error.message}`,
    });
  }
});

const getAContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        status: false,
        message: "Enquiry not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Enquiry Fetched Successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error: ${error.message}`,
    });
  }
});

const deleteAContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({
        status: false,
        message: "Enquiry not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Enquiry Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error: ${error.message}`,
    });
  }
});

const updateAContactStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({
        status: false,
        message: "Enquiry not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Enquiry Status Updated Successfully",
      contact, 
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error: ${error.message}`,
    });
  }
});

module.exports = { createContact, getAllContacts, getAContact, deleteAContact, updateAContactStatus };