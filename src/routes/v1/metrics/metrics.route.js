const express = require("express");
const user = require("../../../middlewares/user.middleware");
const admin = require("../../../middlewares/admin.middleware");
const {
	getMetrics,
	getUsers,
	getNewUsers,
	getFreeTrialUsers,
	getPremiumUser,
	getPremiumPlusUsers,
	getResumes,
	getCoverLetters,
	getPortfolios,
	getAtsScans,
	getReviews,
} = require("./metrics.controller");
const { createQuery, createSearchResult } = require("../../../middlewares/createQuery.middleware");

const metricsRouter = express.Router();
metricsRouter.use(user);
metricsRouter.use(admin);

metricsRouter.get("/", getMetrics);

//  All routes below this point will be affected by the createQuery middleware
metricsRouter.use(createQuery);
metricsRouter.get("/users", getUsers);
metricsRouter.get("/new_users", getNewUsers);
metricsRouter.get("/free_users", getFreeTrialUsers);
metricsRouter.get("/premium_users", getPremiumUser);
metricsRouter.get("/premiumPlus_users", getPremiumPlusUsers);
metricsRouter.get("/resumes", getResumes);
metricsRouter.get("/coverletters", getCoverLetters);
metricsRouter.get("/ats", getAtsScans);
metricsRouter.get("/reviews", getReviews);
metricsRouter.get("/portfolios", getPortfolios);
metricsRouter.use(createSearchResult);

module.exports = metricsRouter;
