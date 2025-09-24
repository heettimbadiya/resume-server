require("dotenv").config();
const express = require("express");
const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.stripe_key);
const User = require("../../schemas/User.schema");

const user = require("../../middlewares/user.middleware");
let prices = ["", process.env.PREMIUM, process.env.PREMIUM_PLUS];

const subscriptionsRouter = express.Router();
const getSubscriptions = asyncHandler(async (req, res) => {
	res.status(200).json(prices);
});
const createSubscriptionCheckoutSession = async (req, res) => {
	const { priceId } = req.query;
	if (!priceId) {
		return res.status(400).json({ error: "Please provide a priceId" });
	}

	try {
		// Returns a URL
		let user = await User.findOne({ _id: req.session.user._id });

		// Check subscription and send create billingPortal if customer exists
		if (!user?.subscription?.customer) {
			const session = await stripe.checkout.sessions.create({
				mode: "subscription",
				customer_email: user.email,
				payment_method_types: ["card"],
				line_items: [
					{
						price: priceId,
						quantity: 1,
					},
				],
				success_url: `${process.env.CLIENT_URL}/pricing/success`,
				cancel_url: `${process.env.CLIENT_URL}/pricing/error`,
			});

			// let subscription = { ...user?.subscription, sessionId: session.id };

			// // Store session.id as subscription in user so it can be retrieved later to update user plan
			// await User.updateOne(
			//   { _id: req.session.user._id },
			//   { $set: { subscription } }
			// );
			res.status(200).json(session);
		} else {
			// Create a biiling
			const billingPortalSession = await stripe.billingPortal.sessions.create({
				customer: user.subscription.customer,
				return_url: `${process.env.CLIENT_URL}/pricing`,
			});

			res.status(200).json(billingPortalSession);
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const handlePaySuccess = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.session.user._id });

		if (!user?.subscription?.sessionId) {
			res.status(403);
			throw new Error("User not authorized to perform this action");
		}
		// Validate session
		const session = await stripe.checkout.sessions.retrieve(user?.subscription?.sessionId);
		if (session.payment_status === "paid") {
			// Update subscription
			// Get subscription'
			const subscription = await stripe.subscriptions.retrieve(session.subscription);
			let { customer, status, plan } = subscription;
			if (status === "active") {
				// Update user's subscription
				plan = prices.findIndex((price) => price == plan.id);

				let subscriptionType = plan >= 0 ? (plan == 1 ? "premium" : plan === 2 ? "premiumPlus" : "free") : "free";
				await User.updateOne(
					{ _id: req.session.user._id },
					{
						$set: {
							subscription: { customer, subscriptionId: session.subscription },
						},
					}
				);
				// Return new subscription
				return res.status(200).json({ success: true, subscriptionType });
			}
			res.status(400);
			throw new Error("There was an error since payment was cancelled");
		} else {
			res.status(400);
			throw new Error("There was an error since payment was cancelled");
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

subscriptionsRouter.get("/", user, getSubscriptions);
subscriptionsRouter.get("/create-subscription-session", user, createSubscriptionCheckoutSession);
subscriptionsRouter.get("/handle-success", user, handlePaySuccess);
module.exports = subscriptionsRouter;
