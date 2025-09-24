var cron = require("node-cron");

const deleteUnverifiedUser = require("./delete-unverified-users");
const sendFreeElapsed = require("./send-free-elapsed");

async function runCron() {
	cron.schedule("* * * * *", sendFreeElapsed);
}

module.exports = runCron;
