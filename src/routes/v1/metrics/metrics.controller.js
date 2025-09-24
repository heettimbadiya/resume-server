const asyncHandler = require("express-async-handler");
const User = require("../../../schemas/User.schema");
const CoverLetter = require("../../../schemas/CoverLetter.schema");
const Resume = require("../../../schemas/Resume.schema");
const Transaction = require("../../../schemas/Transactions.schema");
const Portfolio = require("../../../schemas/Portfolio.schema");
const { getUserPlan } = require("../auth/auth.controller");

const userSelection = { firstname: 1, lastname: 1, email: 1, createdAt: 1, subscription_type: 1, country: 1 };

const getMetrics = asyncHandler(async (_req, res) => {
	const users = await User.countDocuments({});
	const premiumUsers = await User.countDocuments({ subscription_type: "premium" });
	const freeUsers = await User.countDocuments({ subscription_type: "free" });
	const premiumPlusUsers = await User.countDocuments({ subscription_type: "premiumPlus" });
	const coverLetters = await CoverLetter.countDocuments({});
	const resumes = await Resume.countDocuments({});
	const portfolio = await Portfolio.countDocuments({});
	const reviews = 0;
	const atsScans = 0;
	let profits = await Transaction.find({});
	profits = profits?.reduce((total, profit) => total + profit?.price, 0);

	const oneMonthAgo = new Date();
	oneMonthAgo.setUTCMonth(oneMonthAgo.getUTCMonth() - 1);
	const newUsers = await User.countDocuments({
		createdAt: {
			$gte: oneMonthAgo,
			$lt: new Date(),
		},
	});

	// Create the countries
	const allUsers = await User.find({});
	let countries = [];

	allUsers.forEach((user) => {
		let { country } = user;
		if (!country) {
			country = "Not specified";
		}

		// Check if country already exists
		let exists = countries.find((i) => i.name === country);
		if (exists) {
			// Increase count
			countries = countries.map((item) => (item.name === country ? { ...item, count: item?.count + 1 } : item));
			return;
		}
		// Add new country
		countries.push({ name: country, count: 1 });
	});
	//  Sort countries based on registered users
	countries = countries.sort((a, b) => b.count - a.count);
	res.status(200).json({ users, premiumUsers, freeUsers, premiumPlusUsers, coverLetters, resumes, reviews, atsScans, newUsers, profits, portfolio, countries });
});

const getUsers = asyncHandler(async (req, _res, next) => {
	const count = await User.countDocuments();
	const users = await User.find({}, userSelection).skip(req.skip).limit();

	req.data = { data: users, nextPage: count > req.skip + users?.length, count };
	next();
});

const getNewUsers = asyncHandler(async (req, _res, next) => {
	const oneMonthAgo = new Date();
	oneMonthAgo.setUTCMonth(oneMonthAgo.getUTCMonth() - 1);
	const query = {
		createdAt: {
			$gte: oneMonthAgo,
			$lt: new Date(),
		},
	};
	const count = await User.countDocuments(query);
	const users = await User.find(query, userSelection).skip(req.skip).limit();

	req.data = { data: users, nextPage: count > req.skip + users?.length, count };
	next();
});
const getFreeTrialUsers = asyncHandler(async (req, _res, next) => {
	const count = await User.countDocuments({ subscription_type: "free" });
	const users = await User.find({ subscription_type: "free" }, userSelection).skip(req.skip).limit();

	req.data = { data: users, nextPage: count > req.skip + users?.length, count };
	next();
});
const getPremiumUser = asyncHandler(async (req, _res, next) => {
	const count = await User.countDocuments({ subscription_type: "premium" });
	const users = await User.find({ subscription_type: "premium" }, userSelection).skip(req.skip).limit();

	req.data = { data: users, nextPage: count > req.skip + users?.length, count };
	next();
});
const getPremiumPlusUsers = asyncHandler(async (req, _res, next) => {
	const count = await User.countDocuments({ subscription_type: "premiumPlus" });
	const users = await User.find({ subscription_type: "premiumPlus" }, userSelection).skip(req.skip).limit();

	req.data = { data: users, nextPage: count > req.skip + users?.length, count };
	next();
});

const getResumes = asyncHandler(async (req, _res, next) => {
	const count = await Resume.countDocuments();
	let resumes = await Resume.find({}, { jobTitle: 1, name: 1, createdAt: 1 }).populate("author", "email").skip(req.skip).sort({ createdAt: 1 }).limit();
	resumes = resumes?.map((resume) => {
		let { author, jobTitle, name, ...rest } = resume?._doc;
		return { ...rest, email: author?.email, title: name || jobTitle };
	});
	req.data = { data: resumes, nextPage: count > req.skip + resumes?.length, count };
	next();
});

const getCoverLetters = asyncHandler(async (req, _res, next) => {
	const count = await CoverLetter.countDocuments();
	let coverLetters = await CoverLetter.find({}, { jobTitle: 1, name: 1, createdAt: 1 }).populate("author", "email").skip(req.skip).sort({ createdAt: 1 }).limit();
	coverLetters = coverLetters?.map((resume) => {
		let { author, jobTitle, name, ...rest } = resume?._doc;
		return { ...rest, email: author?.email, title: name || jobTitle };
	});
	req.data = { data: coverLetters, nextPage: count > req.skip + coverLetters?.length, count };
	next();
});

const getPortfolios = asyncHandler(async (req, _res, next) => {
	const count = await Portfolio.countDocuments();
	let portfolio = await Portfolio.find({}, { title: 1, createdAt: 1 }).populate("author", "email").skip(req.skip).sort({ createdAt: 1 }).limit();

	portfolio = portfolio?.map((resume) => {
		let { author, title, ...rest } = resume?._doc;
		return { ...rest, email: author?.email, title };
	});
	req.data = { data: portfolio, nextPage: count > req.skip + portfolio?.length, count };
	next();
});
const getAtsScans = asyncHandler(async (req, _res, next) => {
	req.data = { data: [], nextPage: false, count: 0 };
	next();
});

const getReviews = asyncHandler(async (req, _res, next) => {
	req.data = { data: [], nextPage: false, count: 0 };
	next();
});
module.exports = { getMetrics, getUsers, getNewUsers, getFreeTrialUsers, getPremiumUser, getPremiumPlusUsers, getResumes, getCoverLetters, getPortfolios, getAtsScans, getReviews };
