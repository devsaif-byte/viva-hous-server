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
		console.log("Database Connected Successfully!!");
	})
	.catch((err) => {
		console.log("Could not connect to the database", err);
		process.exit();
	});

const newRegisteredUser = require("./users/model/newUsersModel.js");

app.post("/newRegisteredUser", async (req, res) => {
	const user = req.body;
	try {
		const newUser = new newRegisteredUser(user);
		const saveUser = await newUser.save();
		res.json({ message: "User created successfully!", user: saveUser });
	} catch (err) {
		res.status(400).json({
			message: "Something wrong while creating user!",
			error: err.message,
		});
	}
});

app.put("/newRegisteredUser", async (req, res) => {
	await update(req, res);
});

app.put("/newRegisteredUser/admin", async (req, res) => {
	await makeAdmin(req, res);
});

app.get("/newRegisteredUser/:email", async (req, res) => {
	let user = await checkAdmin(req, res);
	console.log(user);
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
// ***************
const propertyRoutes = require("./property/routes/propertyRoutes.js");
const fs = require("fs");
const propertyModel = require("./property/model/propertyModel.js");
const {
	update,
	makeAdmin,
	checkAdmin,
} = require("./users/controller/newUserController.js");
const { log } = require("console");
app.use("/properties", propertyRoutes);

// Define a route for handling GET requests to "/properties"
app.get("/properties", (req, res) => {
	// Read data from the JSON file
	fs.readFile("./property.json", "utf-8", async (err, jsonData) => {
		if (err) {
			console.error("Error reading JSON file:", err);
			res.status(500).json({ message: "Error reading JSON file" });
		} else {
			// Send data to the client
			const data = JSON.parse(jsonData);
			res.json({
				message: "Data retrieved from JSON file successfully",
				data,
			});

			try {
				const result = await propertyModel.createProperties(data);
				console.log(`${result.insertedCount} properties inserted into MongoDB`);
			} catch (err) {
				console.error("Error inserting properties into MongoDB:", err.message);
			}
		}
	});
});

// Define a route for handling POST requests to "/properties"
app.post("/properties", async (req, res) => {
	const data = await req.body.data;

	// Write data to a JSON file
	fs.writeFile("./property.json", JSON.stringify([...data]), (err) => {
		if (err) {
			console.error("Error writing JSON file:", err);
			res.status(500).json({ message: "Error writing JSON file" });
		} else {
			// Send a response indicating that the data has been received and the JSON file has been created
			res.json({
				message: "Data received and JSON file created successfully",
			});
		}
	});
});

app.get("/", (req, res) => {
	res.json({ message: "Hello Node Express Server" });
});
app.listen(3000, () => {
	console.log("Server is listening on port 3000");
});
