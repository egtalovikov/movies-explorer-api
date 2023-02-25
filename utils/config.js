const {
  NODE_ENV, JWT_SECRET, PORT,
} = process.env;

let { MONGO_URL } = process.env;

if (NODE_ENV !== 'production') {
  MONGO_URL = '127.0.0.1:27017/bitfilmsdb';
}

module.exports = {
  PORT, JWT_SECRET, NODE_ENV, MONGO_URL,
};
