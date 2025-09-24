const mongoose = require("mongoose");
const imageSlice = {
	url: String,
	public_id: String,
};

const achievementsSlice = {
	desc: String,
	image: imageSlice,
};
const projectsSlice = {
	link: String,
	image: imageSlice,
};

const socialsSlice = {
	link: String,
	name: String,
};

const portfolioSchema = mongoose.Schema(
	{
		jobTitle: { type: String, default: "" },
		fullname: { type: String, default: "" },
		description: { type: String, default: "" },
		achievements: { type: [achievementsSlice] },
		projects: { type: [projectsSlice] },
		author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		socials: { type: [socialsSlice] },
		image: imageSlice,
		video: imageSlice,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
