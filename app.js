const express = require("express");
const driver = require("./neo4j");
const app = express();

let session = driver.session();

const route1 = require("./routes/route1");
const route2 = require("./routes/route2");
const route3 = require("./routes/route3");

app.use("/route1/", route1);
app.use("/route2/", route2);
app.use("/route3/", route3);

/*Snippet to verify if connection established with the database or not*/
session
  .run("return 1")
  .then(function (result) {
    console.log("Database Connected Successfully");
  })
  .catch(function (err) {
    console.log("Database Connection Failed!..");
  });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
