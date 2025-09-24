const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
	{
		email: {
			required: true,
			type: String,
		},
		name: {
			required: true,
			type: String,
		},
		message: {
			required: true,
			type: String,
		},
		subject: {
			required: true,
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Contact", contactSchema);
