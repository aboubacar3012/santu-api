require('dotenv').config()

const MONGODB_URI =
  process.env.NODE_ENV !== "development"
    ? process.env.MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
};
