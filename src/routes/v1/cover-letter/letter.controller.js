const asyncHandler = require("express-async-handler");
const Letter = require("../../../schemas/CoverLetter.schema");
const { format } = require("date-fns");
const { enUS } = require("date-fns/locale");
const { generateSecuredUrl, deleteFile } = require("../../../libs/glcoud");
const crypto = require("crypto");
const { getUserPlan } = require("../auth/auth.controller");

const randImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

const controllerCreateNewLetter = asyncHandler(async (req, res) => {
	let plan = await getUserPlan(req?.session?.user?.is_admin, req?.session?.user?.subscription);
	if (plan === "free") {
		// Check if user already has a resume
		const resumeCount = await Letter.countDocuments({ author: req.session.user._id });
		if (resumeCount > 0) {
			res.status(400);
			throw new Error("Please upgrade to create more cover letters");
		}
	}
	let response = await Letter.create({ author: req.session.user._id, ...req.body });

	res.status(200).json(response);
});

const controllerGetUserLetters = asyncHandler(async (req, res) => {
	let { page, limit } = req.query;

	if (!page) page = 1;
	if (!limit) limit = 6;
	const all = await Letter.countDocuments({ author: req.session.user._id });
	let response = await Letter.find({ author: req.session.user._id }, { name: 1, updatedAt: 1, thumbnail: 1 })
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

const controllerGetALetter = asyncHandler(async (req, res) => {
	let { letterId } = req.params;

	let response = await Letter.findOne({ _id: letterId }, { author: 0, __v: 0, public_id: 0 });
	if (!response) {
		res.status(404);
		throw new Error("The requested cover letter was not found");
	}

	res.status(200).json(response);
});

const controllerUpdateLetter = asyncHandler(async (req, res) => {
	let { letterId } = req.params;
	const { _id, ...data } = JSON.parse(req.body.letter);

	let response = await Letter.findOne({ _id: letterId }, { __v: 0 });
	if (!response) {
		res.status(404);
		throw new Error("The requested cover letter was not found");
	}
	// Check author
	if (response.author != req.session.user._id) {
		res.status(401);
		throw new Error("User not authorized to perform this operation");
	}

	// Update letter
	if (req.file) {
		// let url = await getSecuredUrl(req.file, "cover-letter", response?.public_id);
		let public_id = response?.public_id && response?.public_id.startsWith("letter/") ? response.public_id : `letter/${randImageName()}`;
		let url = await generateSecuredUrl(req.file, public_id);
		await Letter.updateOne({ _id: letterId }, { $set: { ...data, thumbnail: url, public_id } });
	} else {
		await Letter.updateOne({ _id: letterId }, { $set: data });
	}

	res.status(200).json({ success: true });
});
const controllerDeleteLetter = asyncHandler(async (req, res) => {
	let { letterId } = req.params;

	let response = await Letter.findOne({ _id: letterId }, { author: 1, public_id: 1 });

	if (!response) {
		res.status(404);
		throw new Error("The requested cover letter was not found");
	}
	// Check author
	if (response.author != req.session.user._id) {
		res.status(401);
		throw new Error("User not authorized to perform this operation");
	}

	await deleteFile(response.public_id);
	// Delete Letter
	await Letter.deleteOne({ _id: letterId });

	res.status(200).json({ success: true });
});

module.exports = { controllerCreateNewLetter, controllerGetUserLetters, controllerGetALetter, controllerUpdateLetter, controllerDeleteLetter };
