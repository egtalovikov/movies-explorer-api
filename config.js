const { NODE_ENV, JWT_SECRET, PORT, MONGO_URL } = process.env;

module.exports = { PORT, JWT_SECRET, NODE_ENV, MONGO_URL };
