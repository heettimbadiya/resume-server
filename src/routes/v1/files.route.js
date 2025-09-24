require("dotenv").config();
const express = require("express");
const asyncHandler = require("express-async-handler");

// const { getSecuredUrl } = require("../../libs/cloudinary");
// const { generateSecuredUrl, randImageName, deleteFile } = require("../../libs/aws-s3.js");
const { generateSecuredUrl, randImageName, deleteFile } = require("../../libs/glcoud");
const { uploadToCloudinary } = require("../../libs/multer");
const user = require("../../middlewares/user.middleware");

const filesRouter = express.Router();

const uploadFile = asyncHandler(async (req, res) => {
	// Note _id is the name of the file so that an image gets updated provided itt has a public_id. Name is retained from cloudinary
	let { _id, folder } = req.body;

	if (req.file.size > 5000000) {
		res.status(401);
		throw new Error("The file size should be less than 5MB");
	}
	if (_id) {
		// This means an update, check the extensions and delete if necessary
		let prevExt = _id.split(".")[1];
		let newExt = req.file.mimetype.split("/")[1];
		if (prevExt !== newExt) {
			// Delete file and cause a new id to be generated
			await deleteFile(_id);

			_id = null;
		}
	}
	// // Check file size and throw an error
	const public_id = _id ? _id : `${folder ? folder : "random"}/${randImageName(req.file.mimetype)}`;

	// // let securedUrl = await getSecuredUrl(req.file, "portfolio", _id, type);
	let securedUrl = await generateSecuredUrl(req.file, public_id);

	res.status(200).json({ url: securedUrl, public_id: public_id, filename: req.file.originalname });
});

const deleteFileFromCloudinary = asyncHandler(async (req, res) => {
	await deleteFile(req.body.public_id);
	res.status(200).json({ success: true });
});

filesRouter.post("/upload", user, uploadToCloudinary.single("file"), uploadFile);
filesRouter.post("/delete", user, deleteFileFromCloudinary);

module.exports = filesRouter;
