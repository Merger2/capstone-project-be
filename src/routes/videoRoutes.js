const {
  postVideo,
  getVideo,
  getAllVideo,
  deleteVideo,
  updateVideo,
} = require("../controllers/videoCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const videoRouter = require("express").Router();

videoRouter.post("/", authMiddleware, isAdmin, postVideo);
videoRouter.get("/:slug", getVideo);
videoRouter.get("/", getAllVideo);
videoRouter.delete("/:id", authMiddleware, isAdmin, deleteVideo);
videoRouter.put("/:id", authMiddleware, isAdmin, updateVideo);

module.exports = videoRouter;
