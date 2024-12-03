/* eslint-disable no-undef */
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req?.headers?.authorization?.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token,process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error("Not Authorised, Please Login Again");
        }
    } else {
        throw new Error("There is no token attached to the header...");
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authorized" });
    }

    const { email } = req.user;
    const isAdmin = await User.findOne({ email: email });

    if (!isAdmin) {
        return res.status(404).json({ message: "User not found" });
    }

    if (isAdmin.roles !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
    }

    next();
});

const isInstructor = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authorized" });
    }

    const { email } = req.user;
    const isInstructor = await User.findOne({ email: email });

    if (!isInstructor) {
        return res.status(404).json({ message: "User not found" });
    }

    if (isInstructor.roles !== "instructor") {
        return res.status(403).json({ message: "You are not an instructor" });
    }

    next();
});

module.exports = { authMiddleware, isAdmin, isInstructor };