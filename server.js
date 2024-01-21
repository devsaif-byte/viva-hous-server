const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const bookingRoutes = require("./booking/routes/booking.js");
app.use("/user", bookingRoutes);

const dbConfig = require("./db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose
	.connect(dbConfig.url, {})
	.then(() => {
		console.log("Databse Connected Successfully!!");
	})
	.catch((err) => {
		console.log("Could not connect to the database", err);
		process.exit();
	});

const bookingUser = require("./booking/model/user.js");

app.post("/user/booking", async (req, res) => {
	const userData = req.body;
	// console.log(userData);
	try {
		// Create a user in Database
		const newUser = new bookingUser(userData);
		const savedUser = await newUser.save();
		res.json({ message: "Your booking request successful", user: savedUser });
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error occurred while booking", error: err.message });
	}
});

app.get("/", (req, res) => {
	res.json({ message: "Hello Crud Node Express" });
});
app.listen(3000, () => {
	console.log("Server is listening on port 3000");
});
