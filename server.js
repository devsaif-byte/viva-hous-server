const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const bookingRoutes = require("./booking/routes/booking.js");
const propertyRoutes = require("./property/routes/propertyRoutes.js");
const fs = require("fs");
const propertyModel = require("./property/model/propertyModel.js");
const {
	update,
	makeAdmin,
	checkAdmin,
} = require("./users/controller/newUserController.js");
// const propertyRouter = require("./property/routes/propertyRoutes.js");
app.use("/properties", propertyRoutes);
app.use("/user", bookingRoutes);
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "https://viva3412a.web.app");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

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
		// process.exit();
	});

const newRegisteredUser = require("./users/model/newUsersModel.js");

app.get("/newRegisteredUser/:email", async (req, res) => {
	try {
		let user = await checkAdmin(req, res);
		console.log(user);
		return user;
	} catch (error) {
		console.error("Error in /newRegisteredUser/:email route:", error.message);
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
});

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
	try {
		let user = await update(req, res);
		console.log(user);
		return user;
	} catch (error) {
		console.error("Error in /newRegisteredUser/:email route:", error.message);
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
});

app.put("/newRegisteredUser/:email", async (req, res) => {
	try {
		let user = await makeAdmin(req, res);
		// console.log(user);
		return user;
	} catch (error) {
		console.error("Error in /newRegisteredUser/:email route:", error.message);
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
});

const bookingUser = require("./booking/model/user.js");
const { create, findAll } = require("./booking/controller/bookingUser.js");

const {
	findAllProperties,
} = require("./property/controller/propertyController.js");

app.get("/user/booking", async (req, res) => {
	try {
		const bookings = await findAll(req, res);
		res.json({ message: "Bookings retrieved successfully", data: bookings });
	} catch (err) {
		console.error("Error occurred while fetching bookings:", err.message);
		res.status(500).json({
			message: "Error occurred while fetching bookings",
			error: err.message,
		});
	}
});

app.post("/user/booking", async (req, res) => {
	try {
		// Create a user in Database
		const newBooking = await create(req, res);
		res.json({ message: "Your booking request successful", user: newBooking });
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Error occurred while booking", error: err.message });
	}
});

// Define a route for handling GET requests to "/properties"
// app.get("/properties", (req, res) => {
// 	// Read data from the JSON file
// 	fs.readFile("./property.json", "utf-8", async (err, jsonData) => {
// 		if (err) {
// 			console.error("Error reading JSON file:", err);
// 			res.status(500).json({ message: "Error reading JSON file" });
// 		} else {
// 			// Send data to the client
// 			const data = JSON.parse(jsonData);
// 			res.json({
// 				message: "Data retrieved from JSON file successfully",
// 				data,
// 			});

// 			try {
// 				const result = await propertyModel.createProperties(data);
// 				console.log(`${result.insertedCount} properties inserted into MongoDB`);
// 			} catch (err) {
// 				console.error("Error inserting properties into MongoDB:", err.message);
// 			}
// 		}
// 	});
// });

app.get("/properties", async (req, res) => {
	try {
		const data = await findAllProperties(req, res);
		res.json({
			message: "Data retrieved from Database successfully",
			data,
		});
	} catch (err) {
		console.error("Error receiving properties from MongoDB!", err.message);
	}
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
