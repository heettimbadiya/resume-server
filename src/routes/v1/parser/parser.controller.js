const { spawnSync } = require("child_process");
const asyncHandler = require("express-async-handler");
const formatResumeData = require("../../../utils/dataFormat");
const { generateSecuredUrl, deleteFile } = require("../../../libs/glcoud");
const crypto = require("crypto");
const { format, parse, isDate } = require("date-fns");
const { getUserPlan } = require("../auth/auth.controller");
const ResumeSchema = require("../../../schemas/Resume.schema");

const randImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");
const formatDate = (date) => {
	if (!date) {
		return "";
	}
	const parsedDate = parse(date, "yyyy-MM-dd", new Date());
	if (isDate(parsedDate)) {
		return format(parsedDate, "MM/yyyy");
	}
	return "";
};

const validateUserToParseData = asyncHandler(async (req, res) => {
	const plan = await getUserPlan(req?.session?.user?.is_admin, req.session.user.session);
	if (plan === "free") {
		// Get resume count
		const count = await ResumeSchema.countDocuments({ author: req.session.user._id });
		if (count > 0) {
			res.status(400);
			throw new Error("Upgrade your plan to create more than one resume", { autoClose: 2500 });
		}
	}

	res.status(200).json({ success: true });
});

const controllerParseResume = asyncHandler(async (req, res) => {
	// Check user's details
	const plan = await getUserPlan(req?.session?.user?.is_admin, req.session.user.session);
	if (plan === "free") {
		// Get resume count
		const count = await ResumeSchema.countDocuments({ author: req.session.user._id });
		if (count > 0) {
			res.status(400);
			throw new Error("Upgrade your plan to create more than one resume", { autoClose: 2500 });
		}
	}

	try {
		let { url } = req.body;

		const pythonProcess = await spawnSync(process.env.PYTHON_PATH, [process.env.CONTROLLER_PATH, url]);
		if (pythonProcess?.stderr?.toString()) {
			res.status(500);
			throw new Error("An error occurred while extracting resume data..");
		}
		let data = pythonProcess.stdout?.toString();
		data = await JSON.parse(data);
		data = formatResumeData(data);

		// Store the data
		const resume = await ResumeSchema.create({ ...data, author: req.session.user._id });
		res.status(200).json({ _id: resume._id });
	} catch (e) {
		res.status(500);
		throw new Error("An error occurred while generating Resume...");
	}
});

module.exports = { controllerParseResume, validateUserToParseData };
