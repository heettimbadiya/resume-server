const http = require("http");
const app = require("./app");
const runCron = require("./cron-jobs");

const { connectDB } = require("./libs/mongoose");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

(async function () {
	await connectDB();
	runCron();
	server.listen(PORT, () => {
		console.log(`Listening on PORT ${PORT}...`);
	});
})();
