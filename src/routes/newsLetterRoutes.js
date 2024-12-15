const { subscribe, unsubscribe, getAllSUbscriber } = require("../controllers/newsLetterCtrl");
const newsLetterRouter = require("express").Router();

newsLetterRouter.get("/all", getAllSUbscriber)
newsLetterRouter.post("/", subscribe);
newsLetterRouter.delete("/:id", unsubscribe);

module.exports =  newsLetterRouter ;
