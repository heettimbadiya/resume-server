const express = require("express");
const resumeRouter = express.Router();
const user = require("../../../middlewares/user.middleware");
const { uploadToCloudinary } = require("../../../libs/multer");

const { controllerGetUserResumes, controllerCreateNewResume, controllerGetAResume, controllerDeleteResume, controllerUpdateResume } = require("./resume.controller");

resumeRouter.get("/", user, controllerGetUserResumes);
resumeRouter.post("/new", user, controllerCreateNewResume);
resumeRouter.get("/:resumeId", controllerGetAResume);
resumeRouter.put("/:resumeId", user, uploadToCloudinary.single("image"), controllerUpdateResume);
resumeRouter.delete("/:resumeId", user, controllerDeleteResume);
module.exports = resumeRouter;
