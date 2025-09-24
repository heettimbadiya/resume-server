require("dotenv").config();
const express = require("express");
const asyncHandler = require("express-async-handler");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const { getUserPlan } = require("./auth/auth.controller");
const user = require("../../middlewares/user.middleware");

const pdfRouter = express.Router();

const generatePDF = asyncHandler(async (req, res) => {
  const { html } = req.body;

  if (!html) {
    res.status(400);
    throw new Error("Please provide an html file template");
  }

  // Check user's subscription type and allow only when user
  // let plan = await getUserPlan(req?.session?.user?.is_admin, req?.session?.user?.subscription);
  let plan = req?.session?.user?.subscription_type;
  let elapsedDate =
    new Date().getTime() - new Date(req.session?.user?.created_at);

  if (plan === "free" && elapsedDate > 3600 * 24) {
    res.status(402);
    throw new Error(
      "User not allowed to perform this action. Please upgrade your account"
    );
  }

  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: process.env.CHROME_PATH,
  });
  // const browser = await puppeteer.launch({ headless: "new", executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });

  // Create a new page
  const page = await browser.newPage();

  let customHTML = fs.readFileSync(
    path.join(__dirname, "..", "..", "template.html"),
    "utf-8"
  );
  let styles = fs.readFileSync(
    path.join(__dirname, "..", "..", "styles", "output.css"),
    "utf-8"
  );
  customHTML = customHTML.replace(
    /{{styles}}/i,
    `<style>
			${styles}
		</style>`
  );
  customHTML = customHTML.replace(/{{html}}/i, html);

  // Set the custom HTML content on the page
  await page.setContent(customHTML, { waitUntil: "networkidle0" });

  // Generate the PDF with default options
  const pdfBuffer = await page.pdf({
    width: "215.9mm", // Set the desired width (e.g., in millimeters)
    height: "279mm",
    printBackground: true,
  });

  // Close the browser
  await browser.close();

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=resume.pdf",
  });
  let file = Buffer.from(pdfBuffer);
  res.status(200).send(file);
});

pdfRouter.post("/", user, generatePDF);

module.exports = pdfRouter;
