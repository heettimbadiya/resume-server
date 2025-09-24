const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
	{
		email: {
			required: false,
			type: String,
		},
		password: {
			required: false,
			type: String,
		},
		provider: {
			required: true,
			type: String,
		},
		image: {
			required: false,

			type: String,
		},
		code: {
			required: false,
			type: String,
		},
		id: {
			required: false,
			type: String,
		},
		verified: {
			required: false,
			type: Boolean,
			default: true,
		},
		firstname: {
			type: String,
		},
		lastname: {
			type: String,
		},
		newsletter: {
			type: Boolean,
			default: true,
		},
		subscription_type: {
			type: String,
			default: "free",
		},
		subscription: {
			sessionId: { type: String },
			customer: { type: String },
			subscriptionId: { type: String },
		},
		country: {
			type: String,
		},
		is_admin: {
			type: Boolean,
			immutable: true,
			default: false,
		},
		sub_check_sent: {
			type: Boolean,
			default: false,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);
userSchema.pre("save", async function (next) {
	// Only hash the password if it's new or modified
	if (!this.isModified("password")) {
		return next();
	}

	try {
		await this.hashPassword();
		next();
	} catch (error) {
		return next(error);
	}
});
userSchema.methods.comparePassword = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (error) {
		throw error;
	}
};
userSchema.methods.hashPassword = async function (password) {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(this.password, salt);
		this.password = hashedPassword;
	} catch (error) {
		throw error;
	}
};
userSchema.methods.storeCode = async function (code) {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedcode = await bcrypt.hash(code, salt);
		this.code = hashedcode;
	} catch (error) {
		throw error;
	}
};
userSchema.methods.compareCode = async function (code) {
	try {
		return await bcrypt.compare(code, this.code);
	} catch (error) {
		throw error;
	}
};
userSchema.methods.updatePassword = async function (password) {
	try {
		this.password = password;
		this.code = undefined;
	} catch (error) {
		throw error;
	}
};

module.exports = mongoose.model("User", userSchema);
