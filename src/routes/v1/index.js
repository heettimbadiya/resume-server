const express = require("express");
const authRouter = require("./auth/auth.route");
const contactRouter = require("./contact.route");
const gptRouter = require("./chat_gpt/gpt.route");
const resumeRouter = require("./resume/resume.route");
const letterRouter = require("./cover-letter/letter.route");
const pdfRouter = require("./pdf.route");
const txtRouter = require("./txt.route");
const filesRouter = require("./files.route");
const portfolioRouter = require("./portfolio/portfolio.route");
const subscriptionsRouter = require("./subscription.route");
const metricsRouter = require("./metrics/metrics.route");
const parserRouter = require("./parser/parser.route");
const webhooksRouter = require("./webhooks.route");

const V1Router = express.Router();
V1Router.use("/auth", authRouter);
V1Router.use("/contact", contactRouter);
V1Router.use("/content", gptRouter);
V1Router.use("/resume", resumeRouter);
V1Router.use("/letter", letterRouter);
V1Router.use("/files", filesRouter);
V1Router.use("/portfolio", portfolioRouter);
V1Router.use("/payments/stripe", subscriptionsRouter);
V1Router.use("/metrics", metricsRouter);

V1Router.use("/pdf", pdfRouter);
V1Router.use("/txt", txtRouter);
V1Router.use("/parser", parserRouter);
V1Router.use("/webhooks", webhooksRouter);

V1Router.get("/", (req, res) => {
	res.status(200).json({ started: true });
});

module.exports = V1Router;
