const UserModel = require("../model/user");

// Create and Save a new user
exports.create = async (req, res) => {
	if (
		!req.body.name &&
		!req.body.email &&
		!req.body.phone &&
		!req.body.address
	) {
		res.status(400).send({ message: "Some content can not be empty!" });
	}

	const user = new UserModel({
		name: req.body.name,
		phone: req.body.phone,
		email: req.body.email,
		birthDate: req.body.birthDate,
		address: req.body.address,
	});

	await user
		.save()
		.then((data) =>
			res.send({
				message: "User booking successful!!",
				user: data,
			})
		)
		.catch((err) =>
			res
				.status(500)
				.send({ message: err.message || "Error occurred while booking" })
		);
};

// Retrieve all users from the database.
exports.findAll = async (req, res) => {
	try {
		const user = await UserModel.find();
		res.status(200).json(user);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

// Find a single User with an id
exports.findOne = async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.id);
		res.status(200).json(user);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

// Update a user by the id in the request
exports.update = async (req, res) => {
	if (!req.body) {
		res.status(400).send({
			message: "Data to update can not be empty!",
		});
	}

	const id = req.params.id;

	await UserModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Booking not found.`,
				});
			} else {
				res.send({ message: "booking updated successfully." });
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message,
			});
		});
};

// Delete a user with the specified id in the request
exports.destroy = async (req, res) => {
	await UserModel.findByIdAndDelete(req.params.id)
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Booking not found.`,
				});
			} else {
				res.send({
					message: "booking deleted!",
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message,
			});
		});
};