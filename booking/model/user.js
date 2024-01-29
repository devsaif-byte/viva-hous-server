/*
This model created using mongoose schema
*/

const mongoose = require("mongoose");
const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		default: "",
	},
	phone: {
		type: String,
		default: "",
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	birthDate: {
		type: String,
		default: "",
	},
	address: { type: String, required: true },
});

let bookingUser = new mongoose.model("bookingUser", schema);

module.exports = bookingUser;
