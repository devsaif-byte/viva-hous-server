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
		res.status(400).send({ message: "All fields are required" });

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
		res.status(201).send({
			message: "Property submitted successfully!",
			property: createdProperty,
		});
	} catch (err) {
		if (err.code === 11000)
			return res.status(400).send({ message: "Duplicate property found!" });

		res
			.status(500)
			.send({ message: err.message || "Error occurred while submitting" });
	}
};

exports.deleteProperty = async (req, res) => {};
