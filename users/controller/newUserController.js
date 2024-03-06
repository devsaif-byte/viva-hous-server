const { default: mongoose } = require("mongoose");
const NewUserModel = require("../model/newUsersModel");

exports.create = async (req, res) => {
	const { email, password } = req.body;
	if (!email && !password) {
		res.status(400).json({ message: "Some field can not be empty!" });
	}

	const user = new NewUserModel({
		email,
		password,
	});

	await user
		.save()
		.then((data) =>
			res.json({
				message: "User created successful on database!!",
				user: data,
			})
		)
		.catch((err) =>
			res
				.status(500)
				.json({ message: err.message || "Error occurred while creating user" })
		);
};

// Update/Upsert a user by the email in the request
exports.update = async (req, res) => {
	if (!req.body) {
		res.status(400).json({
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
				res.status(404).json({
					message: `User already exist or something wrong while register.`,
				});
			} else {
				res.json({ message: "user updated successfully." });
			}
		})
		.catch((err) => {
			res.status(500).json({
				message: err.message,
			});
		});
};

exports.makeAdmin = async (req, res) => {
	if (!req.body)
		res.status(400).json({
			message: "No data found!",
		});

	const user = req.body;
	// const user = req.params.email;
	const filter = { email: user.email };

	const checkUserExistence = await NewUserModel.findOne(filter);

	if (checkUserExistence?.role === "admin")
		return res.status(404).json({ message: "User already set as admin" });
	if (!checkUserExistence)
		return res.status(404).json({ message: "This user is not exist" });

	const doc = await NewUserModel.updateOne(filter, { $set: { role: "admin" } })
		.then((data) => {
			if (!data) {
				res.status(404).json({
					message: `Something wrong with the user.`,
				});
			} else {
				res.json({ message: "user role was set to admin." });
			}
		})
		.catch((err) => {
			res.status(500).json({
				message: err.message,
			});
		});
};

exports.checkAdmin = async (req, res) => {
	try {
		if (!req.body) throw new Error("No data found!");
		const email = req.params.email;
		const query = { email };
		const user = await NewUserModel.findOne(query);
		if (!user) {
			return res.status(404).json({
				message: `User not found!.`,
			});
		}
		let isAdmin = user.role === "admin";
		return res.json({
			message: "Checking User role is Admin or not.",
			admin: isAdmin,
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};
