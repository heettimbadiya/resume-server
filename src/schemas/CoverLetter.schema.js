const mongoose = require("mongoose");

const coverLetterSchema = mongoose.Schema(
	{
		name: { type: String },
		firstname: { type: String },
		surname: { type: String },
		jobTitle: { type: String },
		city: { type: String },
		country: { type: String },
		postalcode: { type: String },
		address: { type: String },
		phone: { type: String },
		employerCity: { type: String },
		employerCountry: { type: String },
		employerPostalcode: { type: String },
		employerAddress: { type: String },
		email: { type: String },
		secondaryColor: { type: String, default: "#000000" },
		template: { type: Number },
		template: { type: Number, default: 1 },
		company: { type: String },
		date: { type: String },
		hr: { type: String },
		letter: { type: String },
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		thumbnail: { type: String, default: "" },
		public_id: { type: String, default: "" },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Letter", coverLetterSchema);
