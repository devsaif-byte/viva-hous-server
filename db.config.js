require("dotenv").config();
module.exports = {
	url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jcbkbrr.mongodb.net/?retryWrites=true&w=majority`,
};
