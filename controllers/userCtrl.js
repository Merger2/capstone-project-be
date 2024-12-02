const User = require("../models/userModel");
const asyncHandler = require("express-async-handler"); 
/* create user */

const registerAUser = asyncHandler(async (req, res) => {
    /* get the email from req.body and find whether a user with this email exist or not */
    const email = req.body.email;
    /* find the user with this email get from req.body */
    const findUser = await User.findOne({ email: email });
    if(!findUser) {
        /* create A user */
        const createUser = await User.create(req.body);
        res.status(200).json({
            status:true,
            message: "User Created Successfully!",
            createUser,
        }); 
    }  else {
        throw new Error("User Already Exist")
    }
});

module.exports = { registerAUser };