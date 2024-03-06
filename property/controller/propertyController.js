const propertyModel = require("../model/propertyModel");

exports.createProperty = async (req, res) => {
	const { image, status, price, specification, beds, baths, description } =
		req.body;
	if (
		!image &&
		!status &&
		!price &&
		!specification &&
		!beds &&
		!baths &&
		!description
	)
		res.status(400).json({ message: "All fields are required" });

	try {
		await propertyModel.connect();
		const property = {
			image,
			status,
			price,
			specification,
			beds,
			baths,
			description,
		};
		const createdProperty = await propertyModel.createProperties(property);
		res.status(201).json({
			message: "Property submitted successfully!",
			property: createdProperty,
		});
	} catch (err) {
		if (err.code === 11000)
			return res.status(400).json({ message: "Duplicate property found!" });

		res
			.status(500)
			.json({ message: err.message || "Error occurred while submitting" });
	}
};

exports.findAllProperties = async (req, res) => {
	try {
		const properties = await propertyModel.getPropertiesFromDb();
		console.log(properties);
		res.status(200).json(properties);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

// exports.deleteProperty = async (req, res) => {};
