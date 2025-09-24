const express = require("express");
const portfolioRouter = express.Router();
const user = require("../../../middlewares/user.middleware");

const { controllerGetUserPortfolio, controllerUpdatePortfolio, controllerGetPortfolioWithId } = require("./portfolio.controller");

portfolioRouter.get("/", user, controllerGetUserPortfolio);
portfolioRouter.get("/:portfolioId", controllerGetPortfolioWithId);
portfolioRouter.put("/", user, controllerUpdatePortfolio);

module.exports = portfolioRouter;
