const validateMongoDbId = require('../CONFIG/validateMongoDbId');
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const { generateToken } = require("../CONFIG/jwtToken");
const sendEmail = require("./emailCtrl");
/* create user */

const registerAUser = asyncHandler(async (req, res) => {
  /* get the email from req.body and find whether a user with this email exist or not */
  const email = req.body.email;
  /* find the user with this email get from req.body */
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    /* create A user */
    const createUser = await User.create(req.body);
    res.status(200).json({
      status: true,
      message: "User Created Successfully!",
      createUser,
    });
  } else {
    throw new Error("User Already Exist");
  }
});

/* login user */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  /* check if user exist or not */
  const findUser = await User.findOne({ email: email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.status(200).json({
      status: true,
      message: "Login Succes",
      token: generateToken(findUser?._id),
      role: findUser?.roles,
      username: findUser?.firstname + " " + findUser?.lastname,
      user_image: findUser?.user_image,
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

/* get all user */
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const allUser = await User.find();
    res.status(200).json({
      status: true,
      message: "All User Fetched Succes",
      allUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

/* get A User */
const getAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getProfile = await User.findById(id);
    res.status(200).json({
      status: true,
      message: "User Found",
      getProfile,
    });
  } catch (error) {
    throw new Error(error);
  }
});

/* Update A User Profile */
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
    res.status(200).json({
      status: true,
      message: "profile update sucess",
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

/* delete a user */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "An error occurred while deleting the user",
    });
  }
});

/* Block A User */
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      { isblocked: true },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: "User Blocked Sucess",
    });
  } catch (error) {
    throw new Error(error);
  }
});

/* Unblock A User */
const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const unBlock = await User.findByIdAndUpdate(
      id,
      { isblocked: false },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: "User UnBlocked Sucess",
    });
  } catch (error) {
    throw new Error(error);
  }
});

/* User Update Password */
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);

  /* validation password*/
  if (!password || password.length < 8) {
    return res.status(400).json({
      status: false,
      message: "Password must be at least 8 characters long.",
    });
  }
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User Not Found",
      });
    }
    if (await user.isPasswordMatched(password)) {
      return res.status(400).json({
        status: false,
        message: "Please provide a new password instead of the old one",
      });
    }

    user.password = password;
    await user.save();

    res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error); // Logging
    res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
});

/* forgot password token */
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("User Not Exist with this email.");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetLink = `http://localhost:4000/api/user/reset-password/${token}`;
    const data = {
      to: email,
      text: `Hey ${user.firstname + " " + user.lastname}`,
      subject: "Forgot Password",
      html: resetLink,
    };
    sendEmail(data);
    res.status(200).json(resetLink);
  } catch (error) {
    console.error("Forgot Password error:", error); // Logging
    res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, Please try again");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json({
    status: true,
    message: "Password Reset Successfully",
  });
});

module.exports = {
  registerAUser,
  loginUser,
  getAllUser,
  getAUser,
  updateUser,
  deleteUser,
  blockUser,
  unBlockUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
};
