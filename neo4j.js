const neo4j = require("neo4j-driver");
require("dotenv").config();

const driver = neo4j.driver(
  process.env.uri,
  neo4j.auth.basic(process.env.user, process.env.password)
);

module.exports = driver;
