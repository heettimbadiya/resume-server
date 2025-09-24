require("dotenv").config();
const asyncHandler = require("express-async-handler");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

let html = `<article class="pdf w-full mx-auto gap-12 h-auto p-6 flex justify-start items-start"><div class="w-full h-full"><section class="mb-4"><div class="column"><h1 class="font-bold" style="font-size:28px;color:#37910C">James<!-- --> <!-- -->Royce</h1><p style="font-size:12px;font-weight:light">Product Manager</p></div><article class="w-2/5 ml-auto column"><p style="font-size:12px;font-weight:light">4000 WARNER BLVD, BURBANK, CA 91522-0002</p><p style="font-size:12px;font-weight:light">Burbark<!-- -->, 91504</p><p style="font-size:12px;font-weight:light">USA</p><p style="font-size:12px;font-weight:light">+233 65 231 456</p><p style="font-size:12px;font-weight:light;color:#37910C">jamesroyce@gmail.com</p><p style="font-size:12px;font-weight:light">12th April, 2023</p></article><article class="w-2/5 column"><p style="font-size:12px;font-weight:light">Mr. Tyler</p><p style="font-size:12px;font-weight:light">Human Resource Manager</p><p style="font-size:12px;font-weight:light">EFC Technologies</p><p style="font-size:12px;font-weight:light">5396 North Reese Avenue, Fresno CA 93722</p><p style="font-size:12px;font-weight:light">Los Angeles<!-- -->, USA<!-- -->, 90002</p></article><article class="w-full mt-4 h-auto"><h3 style="font-size:15px;font-weight:bold">Dear <!-- -->Mr. Tyler<!-- -->,</h3><div style="font-size:12px;font-weight:light" class="column my-2"><p>I am writing to express my keen interest in the Project Manager position at EFC Technologies. With a strong background in project management and a track record of delivering successful projects, I am excited about the opportunity to contribute my expertise and leadership skills to EFC Technologies' esteemed team.</p><p><br></p><p>As a Project Manager with [X years] of experience, I have led and managed a diverse range of projects across various industries, including [mention relevant industries]. I thrive in dynamic and fast-paced environments, and my adaptable nature allows me to effectively navigate challenges while maintaining focus on project objectives. I have a deep understanding of project lifecycles and have demonstrated the ability to drive initiatives from inception to successful completion.</p><p><br></p><p>At my previous role as a Project Manager at [Current/Previous Company], I consistently exceeded project goals while ensuring projects were delivered on time and within budget. My hands-on experience with project planning, risk management, resource allocation, and quality assurance enables me to effectively coordinate cross-functional teams and achieve optimal project outcomes.</p><p><br></p><p>I strongly believe in fostering open communication and collaboration among team members and stakeholders. Through my exceptional interpersonal and leadership skills, I create a cohesive and motivated team environment that fosters creativity and innovation. I take pride in building strong relationships with stakeholders and clients, ensuring their needs are met and expectations are surpassed.</p><p><br></p><p>EFC Technologies' commitment to innovation and excellence aligns perfectly with my own professional values. I am particularly drawn to the company's dedication to driving technological advancements that positively impact businesses and communities. As a forward-thinking Project Manager, I am eager to contribute my knowledge and skills to support EFC Technologies' continued success.</p><p><br></p><p>I have attached my resume, which provides further details on my project management experience and accomplishments. I am confident that my qualifications make me a strong fit for this role and an asset to your team.</p><p><br></p><p>Thank you for considering my application. I am eager to discuss how my skills and passion for project management can contribute to EFC Technologies' ongoing growth. I look forward to the opportunity to meet with you and discuss my potential role as a Project Manager in greater detail</p></div><div class="column"><p style="font-size:12px;font-weight:light">Sincerely,</p><p style="font-size:12px;font-weight:light">James<!-- --> <!-- -->Royce</p></div></article></section></div></article>`;
const generateTxt = asyncHandler(async (html) => {
	if (!html) {
		// res.status(400);
		// throw new Error("Please provide an html file template");
		console.log("Html not specified");
		return;
	}

	// Launch a headless browser
	const browser = await puppeteer.launch({ headless: "new", executablePath: process.env.CHROME_PATH });

	// Create a new page
	const page = await browser.newPage();

	let customHTML = fs.readFileSync(path.join(__dirname, "src", "template.html"), "utf-8");
	let styles = fs.readFileSync(path.join(__dirname, "src", "styles", "output.css"), "utf-8");
	customHTML = customHTML.replace(
		/{{styles}}/i,
		`<style>
			${styles}
		</style>`
	);
	customHTML = customHTML.replace(/{{html}}/i, html);

	// Set the custom HTML content on the page
	await page.setContent(customHTML, { waitUntil: "networkidle0" });
	const columns = await page.evaluate(() => {
		const elementsArray = Array.from(document.querySelectorAll(".column"));
		let text = "";

		elementsArray.forEach((element) => {
			let children = Array.from(element.children);
			let innerText = "";
			children.forEach((child) => (innerText += `${child.textContent.trim()} \n`));
			text += `${innerText} \n`;
		});
		return text;
	});
	// for (const column of columns) {
	// 	const textContent = await page.evaluate((el) => el.textContent, column);
	// }
});

generateTxt(html);
