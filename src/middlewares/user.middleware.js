const asyncHandler = require("express-async-handler");
const User = require("../schemas/User.schema");
const user = asyncHandler(async (req, res, next) => {
	// req.session.user = {
	// 	email: "donrixy@gmail.com",
	// 	provider: "google",
	// 	_id: "65049b44ef97d7b7c70446e0",
	// };

	if (!req?.session?.user) {
		res.status(401);
		throw new Error("User not authorized");
	}
	let response = await User.findOne({ _id: req.session.user._id });
	if (!response) {
		res.status(403);
		throw new Error("User not authorized");
	}

	if (response.deleted) {
		res.status(403);
		throw new Error("Account was permanently disabled by user.");
	}

	req.session.user = {
		...req.session.user,
		newsletter: response.newsletter,
		firstname: response.firstname,
		email: response.email,
		provider: response.provider,
		lastname: response.lastname,
		subscription_type: response?.is_admin ? "premiumPlus" : response?.subscription_type || "free",
		country: response?.country || "",
		is_admin: response?.is_admin ? true : false,
		created_at: response.createdAt,
		passwordSet: response?.password ? true : false,
	};
	next();
});

module.exports = user;
