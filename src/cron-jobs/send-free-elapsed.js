const asyncHandler = require("express-async-handler");
const User = require("../schemas/User.schema");
const { checkElapsedTime } = require("../utils/checkElapsedTime");
const { getUserPlan } = require("../routes/v1/auth/auth.controller");
const { sendPrivilgesExpiredEmail } = require("../libs/nodemailer");

const sendFreeElapsed = async () => {
	const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
	// Fetch unverified users
	const users = await User.find({ sub_check_sent: false, createdAt: { $lt: twentyFourHoursAgo } }, { createdAt: 1, email: 1, is_admin: 1, subscription: 1 });

	if (users?.length == 0) return;
	const user = users[0];

	// Check user subscriptions
	const sub = await getUserPlan(user?.is_admin, user?.subscription?.subscriptionId);

	if (sub === "free") {
		// Send email
		try {
			await sendPrivilgesExpiredEmail({ email: user?.email });
		} catch (e) {}
	}
	// Update and return
	await User.updateOne({ _id: user._id }, { $set: { sub_check_sent: true } });
};

module.exports = sendFreeElapsed;
