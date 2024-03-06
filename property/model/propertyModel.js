/*
This model created using mongoDB's way
*/

const { client, connect, collection } = require("../../helpers/script");
const connectToDb = async () => {
	await connect("properties");
};
connectToDb();
const sendPropertiesToDatabase = async (data) => {
	console.log(data);
	try {
		// Check if properties already exist in the database using the 'id' field
		const existingProperties = await collection.find({}).toArray();

		const newProperties = data.filter((property) => {
			// Use 'id' as the unique identifier
			return !existingProperties.some(
				(existingProperty) => existingProperty.id === property.id
			);
		});

		if (newProperties.length > 0) {
			const result = await collection.insertMany(newProperties);
			console.log(
				`${result.insertedCount} new properties inserted into MongoDB`
			);
		} else {
			console.log("No new properties to insert.");
		}
		return true;
	} finally {
		await client.close();
	}
};

const getPropertiesFromDb = async () => {
	try {
		const data = await collection.find({}).toArray();
		return data;
	} finally {
		await client.close();
	}
};

module.exports = {
	createProperties: sendPropertiesToDatabase,
	getPropertiesFromDb,
};
