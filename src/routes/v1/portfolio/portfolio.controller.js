const asyncHandler = require("express-async-handler");
const Portfolio = require("../../../schemas/Portfolio.schema");
const controllerUpdatePortfolio = asyncHandler(async (req, res) => {
	let userId = req.session.user._id;
	let port = await Portfolio.findOne({ author: userId }, { author: 1 });

	if (port) {
		// Update the portfolio
		await Portfolio.updateOne({ author: userId }, { $set: req.body });
		res.status(200).json({ success: true });
		return;
	}
	await Portfolio.create({ ...req.body, author: req.session.user._id });
	res.status(200).json({ success: true });
});

const controllerGetUserPortfolio = asyncHandler(async (req, res) => {
	const userId = req.session.user._id;
	let portfolio = await Portfolio.findOne({ author: userId }, { __v: 0 });

	if (!portfolio) {
		portfolio = await Portfolio.create({ author: userId });
	}
	res.status(200).json(portfolio);
});
const controllerGetPortfolioWithId = asyncHandler(async (req, res) => {
	const { portfolioId } = req.params;
	let portfolio = await Portfolio.findOne({ _id: portfolioId }, { __v: 0 });
	if (!portfolio) {
		res.status(404);
		throw new Error("Portfolio not found");
	}
	res.status(200).json(portfolio);
});
module.exports = {
	controllerUpdatePortfolio,
	controllerGetUserPortfolio,
	controllerGetPortfolioWithId,
};
