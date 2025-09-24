function createQuery(req, _res, next) {
	let { page, search } = req.query;

	if (search) {
		req.search = search;
	}
	page = !page ? 1 : +page;
	req.skip = (page - 1) * 40;

	next();
}

function createSearchResult(req, res) {
	if (!req.search) {
		res.status(200).json(req.data);
		return;
	}

	let filter = [];
	let { count, data, nextPage } = req.data;

	data.filter((item) => {
		let objectKeys = Array.from(Object.keys(item?._doc ? item._doc : item));
		let exists = objectKeys.some((key) => {
			if (typeof item[key] !== "string") return false;
			return item[key]?.toLowerCase().startsWith(req.search.toLowerCase());
		});
		if (exists) {
			filter.push(item);
		}
	});

	res.status(200).json({ count: filter?.length, data: filter, nextPage: false });
}

module.exports = { createQuery, createSearchResult };
