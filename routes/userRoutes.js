const expres = require("express");
const { registerAUser } = require("../controllers/userCtrl");
const userRouter = expres.Router();

userRouter.post("/register", registerAUser);

module.exports = userRouter