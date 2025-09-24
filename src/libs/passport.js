require("dotenv").config();
const passportInstance = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

const GOOGLE_AUTH_OPTIONS = {
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
};
const LINKEDIN_AUTH_OPTIONS = {
	clientID: process.env.LINKEDIN_CLIENT_ID,
	clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
	callbackURL: `${process.env.BASE_URL}/auth/linkedIn/callback`,
};

// Configure Local Strategy
passportInstance.use(
	new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
		let data = { email, password };
		done(null, data);
	})
);

// Define your Passport.js authentication strategies
// GMAIL authentication strategies
passportInstance.use(
	new GoogleStrategy(GOOGLE_AUTH_OPTIONS, async (accessToken, refreshToken, profile, done) => {
		let data = {
			id: profile?.id,
			email: profile?._json?.email || "",
			image: profile?._json?.picture || "",
			provider: "google",
			firstname: profile?.name?.givenName,
			lastname: profile?.name?.familyName,
		};

		done(null, data);
	})
);

// // LINKEDIN authentication strategies
passportInstance.use(
	new LinkedInStrategy(LINKEDIN_AUTH_OPTIONS, async (accessToken, refreshToken, profile, done) => {
		let data = {
			id: profile?.id,
			email: profile?._json?.email || "",
			provider: "linkedIn",
			displayName: profile?.displayName,
		};
		done(null, data);
	})
);

passportInstance.serializeUser(function (user, done) {
	done(null, user);
});

passportInstance.deserializeUser(function (user, done) {
	done(null, user);
});
module.exports = passportInstance;
