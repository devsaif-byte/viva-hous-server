const { connect, collection, client } = require("../../helpers/script");
const UserModel = require("../model/user");
const connectToDb = async () => {
	await connect("bookingusers");
};
connectToDb();
// Create and Save a new user
exports.create = async (req, res) => {
	const requiredProperties = [
		"name",
		"phone",
		"email",
		"address",
		"birthDate",
		"propertyReference",
		"message",
	];

	for (const prop of requiredProperties) {
		if (!req.body.hasOwnProperty(prop)) {
			return res
				.status(400)
				.json({ message: `${prop} is required in the request body.` });
		}
	}

	try {
		const {
			name,
			phone,
			email,
			birthDate,
			address,
			propertyReference,
			message,
		} = req.body;

		if (!name || !email || !phone || !address) {
			return res.status(400).json({ message: "All fields are required." });
		}
		const user = new UserModel({
			name,
			phone,
			email,
			birthDate,
			address,
			propertyReference,
			message,
		});

		const savedUser = await user.save();
		return res.json({
			message: "User booking successful on database!!",
			user: savedUser,
		});
	} catch (err) {
		return res
			.status(500)
			.json({ message: err.message || "Error occurred while booking" });
	}
};

// Retrieve all users from the database.
// exports.findAll = async (req, res) => {
// 	try {
// 		const user = await UserModel.find({});
// 		return res.json(user);
// 	} catch (error) {
// 		return res.status(404).json({ message: error.message });
// 	}
// };

exports.findAll = async (req, res) => {
	try {
		console.log(collection);
		const users = await UserModel.find({});
		console.log(users);
		return res.json(users);
	} catch (error) {
		return res.status(404).json({ message: error.message });
	}
	// finally {
	// 	client.close();
	// }
};

// Find a single User with an id
exports.findOne = async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.id);
		return res.json(user);
	} catch (error) {
		return res.status(404).json({ message: error.message });
	}
};

// Update a user by the id in the request
exports.update = async (req, res) => {
	if (!req.body) {
		return res.status(400).json({
			message: "Data to update can not be empty!",
		});
	}
	const id = req.params.id;
	try {
		const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
			useFindAndModify: false,
			new: true,
		});

		if (!updatedUser) {
			return res.status(404).json({ message: `User not found.` });
		}
		return res.json({
			message: "User updated successfully.",
			user: updatedUser,
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

// Delete a user with the specified id in the request
exports.destroy = async (req, res) => {
	try {
		const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
		if (!deletedUser) {
			return res.status(404).json({
				message: `User not found.`,
			});
		}
		return res.json({
			message: "User deleted successfully!",
		});
	} catch (err) {
		return res.status(500).json({
			message: err.message,
		});
	}
};
