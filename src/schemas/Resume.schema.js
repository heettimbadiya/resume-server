const mongoose = require("mongoose");

const workExperienceSchema = mongoose.Schema({
	title: { type: String },
	employer: { type: String },
	city: { type: String },
	startDate: { type: String },
	endDate: { type: String },
	desc: { type: String },
	current: { type: Boolean },
	name: { type: String },
});

const investmentsSchema = {
	course: { type: String },
	institution: { type: String },
	startDate: { type: String },
	endDate: { type: String },
	name: { type: String },
	desc: { type: String },
};
const achievementsSchema = {
	title: { type: String },
	desc: { type: String },
};
const gapsSchema = {
	activity: { type: String },
	city: { type: String },
	startDate: { type: String },
	endDate: { type: String },
	name: { type: String },
	desc: { type: String },
};
const untitledSchema = {
	activity: { type: String },
	city: { type: String },
	startDate: { type: String },
	endDate: { type: String },
	name: { type: String },
	desc: { type: String },
};
const activitySchema = {
	activity: { type: String },
	city: { type: String },
	startDate: { type: String },
	endDate: { type: String },
	name: { type: String },
	desc: { type: String },
};

const internshipSchema = {
	activity: { type: String },
	city: { type: String },
	startDate: { type: String },
	endDate: { type: String },
	name: { type: String },
	desc: { type: String },
};

const imageSchema = {
	url: { type: String },
	public_id: { type: String },
};

const degreesSchema = {
	institution: { type: String },
	city: { type: String },
	degree: { type: String },
	startDate: { type: String },
	endDate: { type: String },
	desc: { type: String },
	name: { type: String },
};

const resumeSchema = mongoose.Schema(
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
		linkedIn: { type: String },
		twitter: { type: String },
		portfolio: { type: String },
		email: { type: String },
		license: { type: String },
		sc: { type: String },
		secondaryColor: { type: String, default: "#000000" },
		sponsorship: { type: String },
		workExperiences: { title: String, values: [workExperienceSchema] },
		references: { show: Boolean, title: String, ref: String, deleted: Boolean },
		degrees: { title: String, values: [degreesSchema] },
		languages: { title: String, values: [String], deleted: Boolean },
		careerInvestments: { title: String, values: [investmentsSchema], deleted: Boolean },
		careerAchievements: { title: String, values: [achievementsSchema], deleted: Boolean },
		gaps: { title: String, values: [gapsSchema], deleted: Boolean },
		untitled: { title: String, values: [untitledSchema], deleted: Boolean },
		activity: { title: String, values: [activitySchema], deleted: Boolean },
		skills: { type: [String] },
		summary: { type: String },
		hobbies: { title: String, value: String },
		software: { type: [String] },
		template: { type: Number },
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		thumbnail: { type: String, default: "" },
		public_id: { type: String, default: "" },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
