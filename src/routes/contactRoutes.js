const {
    createContact, getAllContacts, getAContact, deleteAContact, updateAContactStatus
  } = require("../controllers/contactCtrl");
  const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
  const contactRouter = require("express").Router();
  
  contactRouter.post("/", authMiddleware, createContact);
  contactRouter.get("/:id", authMiddleware, isAdmin, getAContact);
  contactRouter.get("/", getAllContacts);
  contactRouter.delete("/:id", authMiddleware, isAdmin, deleteAContact);
  contactRouter.put("/:id", authMiddleware, isAdmin, updateAContactStatus);
  
  module.exports = contactRouter;
  