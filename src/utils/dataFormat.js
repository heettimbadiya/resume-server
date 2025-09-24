const formatResumeData = (data) => {
	const workExperiences = data?.workExperiences?.values?.map((exp) => ({
		title: exp?.title,
		employer: exp?.employer,
		city: exp?.location?.city,
		startDate: exp?.startDate,
		endDate: exp?.endDate,
		current: exp?.current,
		desc: exp?.desc,
		name: exp?.name,
	}));
	const references = data?.references?.values?.map((refereer) => ({
		fullname: refereer?.name,
		company: "",
		phone: refereer?.phone,
		email: refereer?.email,
		name: refereer?.name,
	}));
	const degrees = data?.degrees?.values?.map((degree) => ({
		institution: degree?.institution,
		city: degree?.city,
		degree: degree?.degree,
		startDate: degree?.startDate,
		endDate: degree?.endDate,
		desc: degree?.desc,
		name: degree?.name,
	}));
	const skills = data?.skills;

	let formattedData = {
		// Name is the name of the resume which takes the jobTitle by default
		name: data?.jobTitle,
		firstname: data?.firstname,
		surname: data?.surname,
		jobTitle: data?.jobTitle,
		city: data?.city,
		image: { url: "", public_id: "" },
		country: data?.country,
		postalcode: data?.postalCode,
		address: data?.address,
		phone: data?.phone?.length > 0 ? data?.phoneNumbers : "",
		linkedIn: data?.linkedIn,
		twitter: data?.twitter,
		portfolio: data?.portfolio,
		license: data?.license,
		sc: data?.sc,
		secondaryColor: data?.secondaryColor,
		sponsorship: data?.sponsorship,
		workExperiences: { title: "Employment History", values: workExperiences },
		references: { show: true, title: "References", values: references },
		degrees: { title: "Education", values: degrees },
		activity: { title: "Activity", values: [] },
		careerInvestments: { title: "Career Investments", values: [] },
		gaps: { title: "Gap", values: [] },
		untitled: { title: "Untitled", values: [] },
		email: data?.email?.length > 0 ? data?.email : "",
		skills: skills,
		summary: data?.summary,
		hobbies: { title: "Hobbies", value: data?.hobbies },
		software: data?.software,
		languages: { title: "Languages", values: data?.languages?.values || [], deleted: data?.languages?.deleted },
		template: 1,
		thumbnail: "",
	};
	return formattedData;
};

module.exports = formatResumeData;
