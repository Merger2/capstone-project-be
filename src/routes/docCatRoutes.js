const {
  getADocCat,
  postDocCat,
  updateADocCat,
  deleteADocCat,
  allDocument,
} = require("../controllers/docCatCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const docCatRouter = require("express").Router();

docCatRouter.post("/", authMiddleware, isAdmin, postDocCat);

docCatRouter.get("/", allDocument);
docCatRouter.get("/:slug", authMiddleware, isAdmin, getADocCat);

docCatRouter.put("/:id", authMiddleware, isAdmin, updateADocCat);

docCatRouter.delete("/:id", authMiddleware, isAdmin, deleteADocCat);

module.exports = docCatRouter;
