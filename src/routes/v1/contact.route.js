const express = require("express");
const asyncHandler = require("express-async-handler");

const Contact = require("../../schemas/Contact.schema");
const { sendContactEmail } = require("../../libs/nodemailer");

const contactRouter = express.Router();
const getContacts = asyncHandler(async (req, res) => {
	let response = await Contact.find();
	res.status(200).json(response);
});

const postContact = asyncHandler(async (req, res) => {
	let { name, email, message, subject } = req.body;
	if (!name || !email || !message) {
		res.status(400);
		throw new Error("Please fill in all required fields");
	}
	// Send email here
	await sendContactEmail({ name, email, message, subject: subject ? subject : `Contact message from ${name}` });

	// Store data
	await Contact.create({ name, email, message, subject: subject ? subject : `Contact message from ${name}` });
	res.status(200).json({ success: true });
});

const sendContactMessageXennol = asyncHandler(async (req, res) => {
	let { name, email, message } = req.body;
	if (!name || !email || !message) {
		res.status(400);
		throw new Error("Please fill in all required fields");
	}
	// Send email here
	await sendContactEmail({ name, email, message, subject: `Contact message from ${name}`, site: "xennol" });

	res.status(200).json({ success: true });
});

contactRouter.get("/", getContacts);
contactRouter.post("/", postContact);
contactRouter.post("/xennol", sendContactMessageXennol);

module.exports = contactRouter;
