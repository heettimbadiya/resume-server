require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { Configuration, OpenAIApi } = require("openai");
// const readlineSync = require("readline-sync");

const configuration = new Configuration({
	apiKey: process.env.GPT_KEY,
});
const openai = new OpenAIApi(configuration);

function splitRole(text, roles) {
	roles.forEach((role) => {
		let Reg = new RegExp(role, "i");
		text = text.replace(Reg, "");
	});
	return text;
}
const controllerGenerateAnswer = asyncHandler(async (message, number = 1) => {
	conversation = [{ role: "user", content: message }];
	try {
		// Get an answer
		const response = await openai.createCompletion({
			model: "text-davinci-003", // Choose the appropriate model
			prompt: conversation.map((message) => `${message.role}: ${message.content}`).join("\n"),
			max_tokens: 3000,
			temperature: 0.9,
			n: number,
			frequency_penalty: 0.5,
			presence_penalty: 0,
		});
		let { text, finish_reason } = response.data.choices[0];
		let info = response.data.choices.map((choice) => {
			let text = splitRole(choice.text, ["Assistant:", "System:"]);
			return text;
		});
		return info;
	} catch (e) {
		return { error: e.message };
	}
});
const controllerGenerateSummary = asyncHandler(async (req, res) => {
	req.message = `Please provide a concise summary for the resume of a ${req.body.profession}, with each point expanded into a longer one-sentence description.}`;

	let response = await controllerGenerateAnswer(req.message, 10);
	if (response.error) {
		res.status(400);
		throw new Error("An error occurred while generating personalized content");
	}
	res.status(200).json(response);
});

const controllerGenerateDescriptions = asyncHandler(async (req, res) => {
	req.message = `Please provide a descriptive bullet list of descriptions for a work history of a ${req.body.profession}.`;
	let response = await controllerGenerateAnswer(req.message, 1);
	if (response.error) {
		res.status(400);
		throw new Error("An error occurred while generating personalized content");
	}
	response = response[0].replace(/\n/gi, "");
	response = response.split("• ");
	response = response.filter((res) => res !== "");
	res.status(200).json(response);
});

const controllerCoverLetter = asyncHandler(async (req, res) => {
	req.message = `Create a detailed paragraph describing why you are the ideal candidate for the role of a ${req.body.profession}. Paragraph should have at least 4 sentences each`;
	let response = await controllerGenerateAnswer(req.message, 10);
	if (response.error) {
		res.status(400);
		throw new Error("An error occurred while generating personalized content");
	}
	res.status(200).json(response);
});

module.exports = { controllerGenerateAnswer, controllerGenerateSummary, controllerGenerateDescriptions, controllerCoverLetter };
