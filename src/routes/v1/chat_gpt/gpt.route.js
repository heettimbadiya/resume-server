const express = require("express");
const { controllerGenerateSummary, controllerGenerateDescriptions, controllerCoverLetter } = require("./gpt.controller");

const gptRouter = express.Router();
gptRouter.use((req, res, next) => {
	let { title } = req.body;
	if (!title) {
		res.status(400);
		throw new Error("Please provide your profession");
	}
	next();
});

gptRouter.post("/summary", controllerGenerateSummary);
gptRouter.post("/description", controllerGenerateDescriptions);
gptRouter.post("/cv-letter", controllerGenerateDescriptions);

module.exports = gptRouter;
