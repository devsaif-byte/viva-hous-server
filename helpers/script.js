const { MongoClient } = require("mongodb");
const { url } = require("../db.config");
const databaseName = "test";

let client, database, collection;

const connect = async (collectionName) => {
	try {
		client = new MongoClient(url, {});
		await client.connect();
		database = client.db(databaseName);
		collection = database.collection(collectionName);
		return collection;
	} catch (err) {
		console.error(
			"Error happened while connecting to the database",
			err.message
		);
	}
};

module.exports = {
	connect,
	collection,
	client,
};
