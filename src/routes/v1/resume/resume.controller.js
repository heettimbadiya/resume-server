const asyncHandler = require("express-async-handler");
const Resume = require("../../../schemas/Resume.schema");
const { format } = require("date-fns");
const { enUS } = require("date-fns/locale");
// const { getSecuredUrl, deleteFile } = require("../../../libs/cloudinary");
const { generateSecuredUrl, deleteFile } = require("../../../libs/glcoud");
const crypto = require("crypto");
const { getUserPlan } = require("../auth/auth.controller");

const randImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

const controllerCreateNewResume = asyncHandler(async (req, res) => {
	let plan = await getUserPlan(req?.session?.user?.is_admin, req?.session?.user?.subscription);
	if (plan === "free") {
		// Check if user already has a resume
		const resumeCount = await Resume.countDocuments({ author: req.session.user._id });
		if (resumeCount > 0) {
			res.status(400);
			throw new Error("Please upgrade to create more resumes");
		}
	}
	let response = await Resume.create({ author: req.session.user._id, ...req.body });

	res.status(200).json(response);
});

const controllerGetUserResumes = asyncHandler(async (req, res) => {
	let { page, limit } = req.query;

	if (!page) page = 1;
	if (!limit) limit = 6;
	const all = await Resume.countDocuments({ author: req.session.user._id });
	let response = await Resume.find({ author: req.session.user._id }, { name: 1, updatedAt: 1, thumbnail: 1 })
		.sort({ _id: -1 })
		.skip(limit * (page - 1))
		.limit(limit);
	response = response.map((res) => {
		// const options = {
		// 	day: "numeric",
		// 	month: "long",
		// 	hour: "numeric",
		// 	minute: "numeric",
		// 	hour12: false,
		// };
		let updatedAt = "";
		let date = new Date(res.updatedAt);
		if (date == "Invalid Date") {
			updatedAt = "";
		} else {
			updatedAt = format(date, "dd MMMM, HH:mm", { locale: enUS });
		}

		return { ...res._doc, updatedAt };
	});
	res.status(200).json({ content: response, nextPage: all > response.length + (page - 1) * 6 });
});

const controllerGetAResume = asyncHandler(async (req, res) => {
	let { resumeId } = req.params;

	let response = await Resume.findOne({ _id: resumeId }, { author: 0, __v: 0 });
	if (!response) {
		res.status(404);
		throw new Error("The requested resume was not found");
	}

	res.status(200).json(response);
});

const controllerUpdateResume = asyncHandler(async (req, res) => {
	let { resumeId } = req.params;
	const { _id, ...data } = JSON.parse(req.body.resume);
	let response = await Resume.findOne({ _id: resumeId }, { __v: 0 });
	if (!response) {
		res.status(404);
		throw new Error("The requested resume was not found");
	}
	// Check author
	if (response.author != req.session.user._id) {
		res.status(401);
		throw new Error("User not authorized to perform this operation");
	}
	// Update resume
	if (req.file) {
		let public_id = response?.public_id && response?.public_id.startsWith("resume/") ? response.public_id : `resume/${randImageName()}`;

		let url = await generateSecuredUrl(req.file, public_id);

		await Resume.updateOne({ _id: resumeId }, { $set: { ...data, thumbnail: url, public_id } });
	} else {
		await Resume.updateOne({ _id: resumeId }, { $set: data });
	}

	res.status(200).json({ success: true });
});
const controllerDeleteResume = asyncHandler(async (req, res) => {
	let { resumeId } = req.params;

	let response = await Resume.findOne({ _id: resumeId }, { author: 1, public_id: 1 });
	if (!response) {
		res.status(404);
		throw new Error("The requested resume was not found");
	}
	// Check author
	if (response.author != req.session.user._id) {
		res.status(401);
		throw new Error("User not authorized to perform this operation");
	}

	// Delete thumbnail
	if (response?.public_id) {
		await deleteFile(response?.public_id);
	}
	// Delete resume
	await Resume.deleteOne({ _id: resumeId });
	res.status(200).json({ success: true });
});

module.exports = { controllerCreateNewResume, controllerGetUserResumes, controllerGetAResume, controllerUpdateResume, controllerDeleteResume };
