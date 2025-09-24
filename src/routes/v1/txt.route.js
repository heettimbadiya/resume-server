require("dotenv").config();
const express = require("express");
const asyncHandler = require("express-async-handler");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const txtRouter = express.Router();

const generateTxt = asyncHandler(async (req, res) => {
	let { html, type: txtType } = req.body;

	if (!html || !txtType) {
		res.status(400);
		throw new Error("Please provide an html file template");
	}
	// Launch a headless browser
	const browser = await puppeteer.launch({ headless: "new", executablePath: process.env.CHROME_PATH });

	// Create a new page
	const page = await browser.newPage();

	let customHTML = fs.readFileSync(path.join(__dirname, "..", "..", "template.html"), "utf-8");
	let styles = fs.readFileSync(path.join(__dirname, "..", "..", "styles", "output.css"), "utf-8");
	customHTML = customHTML.replace(
		/{{styles}}/i,
		`<style>
			${styles}
		</style>`
	);

	customHTML = customHTML.replace(/{{html}}/i, html);
	// Remove line breaks
	customHTML = customHTML.replace(/<br>/gi, "");
	// Remove svgs
	customHTML = customHTML.replace(/\<svg.*?\<\/svg\>/g, "");

	// Set the custom HTML content on the page
	await page.setContent(customHTML, { waitUntil: "networkidle0" });
	let textContent = await page.evaluate(() => {
		function getChildText(grandparent) {
			let returnText = "";
			let current = grandparent;
			let children = Array.from(current.children);

			if (children.length > 0) {
				children.forEach((child) => {
					// For checking if it is a resume or coverLetter
					let txt = getChildText(child);
					returnText += `${txt} \n`;
				});
			} else {
				returnText += `${current.textContent.trim()}`;
			}
			return returnText;
		}
		const elementsArray = Array.from(document.querySelectorAll(".column"));
		let text = "";

		elementsArray.forEach((element) => {
			let childText = getChildText(element);
			text += `${childText} \n`;
		});
		return text;
	});

	textContent = textContent.replace(/ (?:\n\s*){2,}/g, "\n\n");

	res.set({
		"Content-Type": "application/txt",
		"Content-Disposition": "attachment; filename=file.txt",
	});
	let file = Buffer.from(textContent);
	res.status(200).send(file);

	// const filePath = "output.txt";
	// fs.writeFile(filePath, textContent, { encoding: "utf8", flag: "w" }, (err) => {
	// 	if (err) {
	// 		console.error("Error writing the file:", err);
	// 	} else {
	// 		console.log(`File saved successfully as ${filePath}`);
	// 	}
	// });
	// res.status(200).json({ success: true });
});

txtRouter.post("/", generateTxt);

module.exports = txtRouter;
