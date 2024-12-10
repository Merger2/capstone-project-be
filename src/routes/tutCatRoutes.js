const { postTutorialCategory } = require("../controllers/tutCatCtrl");
const tutCatRouter = require("express").Router();

tutCatRouter.post("/post", postTutorialCategory);

module.exports = tutCatRouter;
