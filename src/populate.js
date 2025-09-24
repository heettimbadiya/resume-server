require("dotenv").config();
const http = require("http");
const stripe = require("stripe")(process.env.stripe_key);

const { connectDB } = require("./libs/mongoose");

(async function () {
	await connectDB();

	// Create stripe payment objects
	await createProducts();
})();

async function createProducts() {
	const premiumProduct = await stripe.products.create({
		name: "Premium Plan",
	});

	const premiumPlusProduct = await stripe.products.create({
		name: "Premium Plus Plan",
	});

	const premiumPrice = await stripe.prices.create({
		unit_amount: 1499,
		currency: "eur",
		recurring: {
			interval: "month",
		},
		product: premiumProduct.id,
	});

	const premiumPlusPrice = await stripe.prices.create({
		unit_amount: 1999,
		currency: "eur",
		recurring: {
			interval: "month",
		},
		product: premiumPlusProduct.id,
	});

	console.log("Copy and paste the result of the object logged below into /data/pricings.js if you want to create new pricings altogether");

	console.log({
		premium: {
			priceId: premiumPrice.id,
			unit_amount: premiumPrice?.unit_amount,
			currency: premiumPrice?.currency,
		},
		premiumPlus: {
			priceId: premiumPlusPrice.id,
			unit_amount: premiumPlusPrice?.unit_amount,
			currency: premiumPlusPrice?.currency,
		},
	});
}
