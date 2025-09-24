const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
	{
		price: {
			required: true,
			type: Number,
		},
		user: {
			required: true,
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		id: {
			required: true,
			type: String,
		},
		object: {
			type: String,
		},
		subscriptionPlan: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Transaction", transactionSchema);
