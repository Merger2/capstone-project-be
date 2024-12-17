const express = require("express");
const documentRouter = express.Router(); // Memanggil Router dari Express
const {
  postdoc,
  getdoc,
  getAlldoc,
  deletedoc,
  updatedoc,
} = require("../controllers/docCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

documentRouter.post("/", authMiddleware, isAdmin, postdoc);
documentRouter.get("/:slug", getdoc);
documentRouter.get("/", getAlldoc);
documentRouter.delete("/:id", authMiddleware, isAdmin, deletedoc);
documentRouter.put("/:id", authMiddleware, isAdmin, updatedoc);

module.exports = documentRouter; // Pastikan ekspor menggunakan module.exports
