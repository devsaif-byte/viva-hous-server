const { default: mongoose } = require("mongoose");
const NewUserModel = require("../model/newUsersModel");

exports.create = async (req, res) => {
	const { email, password } = req.body;
	if (!email && !password) {
		res.status(400).send({ message: "Some field can not be empty!" });
	}

	const user = new NewUserModel({
		email,
		password,
	});

	await user
		.save()
		.then((data) =>
			res.send({
				message: "User created successful on database!!",
				user: data,
			})
		)
		.catch((err) =>
			res
				.status(500)
				.send({ message: err.message || "Error occurred while creating user" })
		);
};

// Update/Upsert a user by the email in the request
exports.update = async (req, res) => {
	if (!req.body) {
		res.status(400).send({
			message: "Data to update can not be empty!",
		});
	}

	const filter = { email: req.body.email };
	const update = req.body;

	const doc = await NewUserModel.findOneAndUpdate(filter, update, {
		useFindAndModify: false,
		new: true,
		upsert: true,
		includeResultMetadata: true,
	})
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `User already exist or something wrong while register.`,
				});
			} else {
				res.send({ message: "user updated successfully." });
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message,
			});
		});
};

exports.makeAdmin = async (req, res) => {
	if (!req.body)
		res.status(400).send({
			message: "No data found!",
		});

	const user = req.body;
	const filter = { email: user.email };

	const doc = await NewUserModel.updateOne(filter, { $set: { role: "admin" } })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Something wrong with the user.`,
				});
			} else {
				res.send({ message: "user role was set to admin." });
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message,
			});
		});
};

exports.checkAdmin = async (req, res) => {
	if (!req.body)
		res.status(400).send({
			message: "No data found!",
		});
	const email = req.params.email;
	const query = { email };
	const user = await NewUserModel.findOne(query)
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `User not found!.`,
				});
			} else {
				res.send({ message: "Checking User role is Admin or not.", data });
				let isAdmin = false;
				if (data?.role === "admin") {
					isAdmin = true;
				}
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message,
			});
		});
	return user;
};
