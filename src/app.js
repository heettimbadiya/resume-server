const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");

const errorMiddleware = require("./middlewares/error.middleware");
const V1Router = require("./routes/v1");
const webhookRouter = require("./routes/v1/webhooks.route");

const app = express();
app.use(morgan("combined"));
app.use("/api/webhooks", webhookRouter);

app.use(express.json());
// app.set("trust proxy", true);

let initialObj = {
	secret: "thisisascretkeythatwillbechangedsoon",
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		sameSite: "strict",
	},
};
app.use(session(initialObj));

app.use(cors());

app.use("/api/v1", V1Router);

app.use(errorMiddleware);

module.exports = app;
