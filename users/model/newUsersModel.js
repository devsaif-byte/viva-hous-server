/*
This model created using mongoose schema
*/

const mongoose = require("mongoose");
const newUserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
	},
});

let newUser = new mongoose.model("user", newUserSchema);

module.exports = newUser;
