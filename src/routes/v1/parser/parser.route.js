const express = require("express");
const parserRouter = express.Router();
const user = require("../../../middlewares/user.middleware");
const { uploadToCloudinary } = require("../../../libs/multer");

const { controllerParseResume, validateUserToParseData } = require("./parser.controller");

parserRouter.post("/", user, controllerParseResume);
parserRouter.get("/validate", user, validateUserToParseData);

module.exports = parserRouter;
