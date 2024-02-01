/*
This model created using mongoose schema
*/

const mongoose = require("mongoose");
const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	birthDate: {
		type: String,
	},
	address: {
		type: String,
		required: true,
	},
	propertyReference: {
		type: String,
	},
	message: {
		type: String,
	},
});

let bookingUser = new mongoose.model("bookingUser", schema);

module.exports = bookingUser;
