const { Storage } = require("@google-cloud/storage");

const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const storage = new Storage({ projectId: process.env.PROJECT_ID, keyFilename: process.env.GCLOUD_KEY_FILENAME });

const generateSecuredUrl = asyncHandler(async (file, destination) => {
	const promise = new Promise((resolve, reject) => {
		const fileStream = storage
			.bucket(process.env.GCLOUD_BUCKET_NAME)
			.file(destination)
			.createWriteStream({
				metadata: {
					contentType: file.mimetype,
				},
				public: true,
			});
		// Handle stream events and errors
		fileStream.on("error", (err) => {
			console.error("Error uploading file:", err);
			reject();
		});

		fileStream.on("finish", () => {
			console.log(`File uploaded successfully: https://storage.googleapis.com/${process.env.GCLOUD_BUCKET_NAME}/${destination}`);
			resolve();
		});

		// Write the buffer to the stream
		fileStream.end(file.buffer);
	});
	await promise;
	return `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET_NAME}/${destination}`;
});

const deleteFile = asyncHandler(async (destination) => {
	try {
		await storage.bucket(process.env.GCLOUD_BUCKET_NAME).file(`${destination}`).delete();
	} catch (e) {}
});

const randImageName = (fileType, bytes = 32) => {
	let ext = fileType.split("/")[1];
	return crypto.randomBytes(bytes).toString("hex") + "." + ext;
};

module.exports = { generateSecuredUrl, deleteFile, randImageName };
