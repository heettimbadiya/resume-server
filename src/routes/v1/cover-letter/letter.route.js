const express = require("express");
const letterRouter = express.Router();
const user = require("../../../middlewares/user.middleware");
const { uploadToCloudinary } = require("../../../libs/multer");

const { controllerGetUserLetters, controllerCreateNewLetter, controllerGetALetter, controllerDeleteLetter, controllerUpdateLetter } = require("./letter.controller");

letterRouter.get("/", user, controllerGetUserLetters);
letterRouter.post("/new", user, controllerCreateNewLetter);
letterRouter.get("/:letterId", controllerGetALetter);
letterRouter.put("/:letterId", user, uploadToCloudinary.single("image"), controllerUpdateLetter);
letterRouter.delete("/:letterId", user, controllerDeleteLetter);
module.exports = letterRouter;
