const express = require("express");
const passportInstance = require("../../../libs/passport");
const {
	controllerAuthThirdParty,
	controllerAuthLocalLogin,
	controllerAuthLocalRegister,
	controllerResetPassword,
	controllerConfirmReset,
	controllerChangePassword,
	controllerGetUser,
	controllerLogoutUser,
	controllerVerifyEmail,
	controllerResendEmail,
	controllerUpdateUserData,
	controllerUpdateUserPassword,
	controllerUpdateNewsLetterSubscription,
	controllerDeleteAccount,
} = require("./auth.controller");
const user = require("../../../middlewares/user.middleware");

const authRouter = express.Router();

authRouter.get("/google", passportInstance.authenticate("google", { scope: ["email", "profile"] }));
authRouter.get("/google/callback", passportInstance.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/auth/login` }), controllerAuthThirdParty);
authRouter.get("/verify", user, controllerGetUser);

authRouter.get("/facebook", passportInstance.authenticate("facebook"));
authRouter.get(
	"/facebook/callback",
	passportInstance.authenticate("facebook", {
		failureRedirect: `${process.env.CLIENT_URL}/auth/login`,
	}),
	controllerAuthThirdParty
);
authRouter.get("/twitter", passportInstance.authenticate("twitter"));
authRouter.get("/twitter/callback", passportInstance.authenticate("twitter", { failureRedirect: `${process.env.CLIENT_URL}/auth/login` }), controllerAuthThirdParty);

authRouter.get("/linkedin", passportInstance.authenticate("linkedin"));
authRouter.get("/linkedin/callback", passportInstance.authenticate("linkedin", { failureRedirect: `${process.env.CLIENT_URL}/auth/login` }), controllerAuthThirdParty);

authRouter.get("/github", passportInstance.authenticate("github"));
authRouter.get("/github/callback", passportInstance.authenticate("github", { failureRedirect: `${process.env.CLIENT_URL}/auth/login` }), controllerAuthThirdParty);

authRouter.post(
	"/local/login",
	passportInstance.authenticate("local"),
	(req, res, next) => {
		if (req.body.cookie) {
			req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
		} else {
			req.session.cookie.expires = false;
		}
		next();
	},
	controllerAuthLocalLogin
);
authRouter.post("/local/register", passportInstance.authenticate("local"), controllerAuthLocalRegister);
authRouter.post("/local/resetPassword", controllerResetPassword);
authRouter.post("/local/confirmReset", controllerConfirmReset);
authRouter.post("/local/changePassword", controllerChangePassword);
authRouter.post("/local/verifyEmail", controllerVerifyEmail);
authRouter.post("/local/resendEmail", controllerResendEmail);

authRouter.get("/user", user, controllerGetUser);

authRouter.get("/logout", user, controllerLogoutUser);

authRouter.put("/userDetails", user, controllerUpdateUserData);
authRouter.put("/userPassword", user, controllerUpdateUserPassword);

authRouter.delete("/user", user, controllerDeleteAccount);
authRouter.put("/user/newsletter", user, controllerUpdateNewsLetterSubscription);
module.exports = authRouter;
