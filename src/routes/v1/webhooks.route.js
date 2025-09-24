const express = require("express");
const asyncHandler = require("express-async-handler");
require("dotenv").config();
const stripe = require("stripe")(process.env.stripe_key);
const pricings = require("../../data/pricings");
const mongoose = require("mongoose");
const User = require("../../schemas/User.schema");
const Transaction = require("../../schemas/Transactions.schema");

const endpointSecret = "whsec_hiFQ9DEFr7SOEP6hsMsmMs0dIByksvHZ";
const webhookRouter = express.Router();

webhookRouter.use(express.raw({ type: "application/json" }));

const validatePayment = asyncHandler(async (amount, customer, id, object, email, subscriptionId) => {
	try {
		const user = await User.findOne({ email: email });

		if (!user) return;

		let pricingKeys = Array.from(Object.keys(pricings));

		let pricingType = pricingKeys.find((key) => {
			return pricings[key].unit_amount === amount;
		});

		// When an intent is presented, we use the information from the intent to update the DB accordingly
		// Fetch transaction
		const transaction = await Transaction.findOne({ id, object });
		if (transaction) {
			throw new Error("Transaction has already been recorded");
		}

		const session = await mongoose.startSession();
		session.startTransaction();
		const options = { session };
		let data = {
			id,
			object,
			price: amount / 100,
			user: user._id,
			subscriptionPlan: pricingType,
		};
		// Update transaction and user
		await Transaction.create([data], options);

		// Update user's subscription
		const subscription = await stripe.subscriptions.retrieve(subscriptionId);
		const { status, plan } = subscription;
		if (status === "active") {
			let prices = ["", process.env.PREMIUM, process.env.PREMIUM_PLUS];

			let planIndex = prices.findIndex((price) => price == plan.id);
			let subscriptionType = planIndex >= 0 ? (planIndex == 1 ? "premium" : planIndex === 2 ? "premiumPlus" : "free") : "free";
			console.log("setting  customer and subscription type", user._id, subscriptionId, subscriptionType);
			await User.updateOne(
				{ _id: user._id },
				{
					$set: {
						subscription: { customer, subscriptionId },
						subscription_type: subscriptionType,
					},
				},
				options
			);
		}

		await session.commitTransaction();
		session.endSession();

		console.log("Updated user based on successful payment");
	} catch (error) {
		console.error(error);
		// res.status(400).json({ error: error.message });
	}
});

const postWebHook = asyncHandler(async (req, res) => {
	const sig = req.headers["stripe-signature"];

	let event;

	try {
		event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
	} catch (err) {
		res.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}

	// Handle the event
	const data = event.data.object;

	// Listen for successful payments
	if (event.type === "invoice.payment_succeeded") {
		const { amount_paid, customer, id, object, customer_email, subscription } = data;
		// Use this to update the subscription of the customer

		validatePayment(amount_paid, customer, id, object, customer_email, subscription);
	} else if (event.type === "invoice.payment_failed") {
		// Update user details based on invoice.payment_falied
		const { customer } = data;
		// Cancel subscription and set type to free
		await User.updateOne({ "subscription.customer": customer }, { $set: { subscription_type: "free" } });
	} else if (event.type === "customer.subscription.deleted") {
		// Use this to update the subscription of the customer when customer deletes their subscription
		const { customer, canceled_at, status } = data;
		let newDate = new Date().getTime();

		if (status !== "active" && canceled_at && canceled_at < newDate / 1000) {
			// Update user to remove subscription
			const user = await User.findOne({ customer_id: customer });
			if (!user) return;
			if (user?.subscription_type !== "free") {
				await User.updateOne({ "subscription.customer": customer }, { $set: { subscription_type: "free" } });
			}
		}
	}
	// Return a 200 response to acknowledge receipt of the event
	res.status(200).send("Webhook received");
});
webhookRouter.post("/", postWebHook);

module.exports = webhookRouter;
