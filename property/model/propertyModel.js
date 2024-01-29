/*
This model created using mongoDB's way
*/

const { MongoClient } = require("mongodb");
const { url } = require("../../db.config");

const databaseName = "test";
const collectionName = "properties";

let client, database, collection;

const connect = async () => {
	try {
		client = new MongoClient(url, {});
		await client.connect();
		database = client.db(databaseName);
		collection = database.collection(collectionName);
	} catch (err) {
		console.error(
			"Error happened while connecting to the database",
			err.message
		);
	}
};

const sendPropertiesToDatabase = async (data) => {
	console.log(data);
	try {
		await connect();

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
	} catch (err) {
		console.log("Could not connect the database", err.message);
		throw err;
	} finally {
		await client.close();
	}
};

module.exports = {
	connect,
	createProperties: sendPropertiesToDatabase,
};
