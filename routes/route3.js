const express = require("express");
const router = express.Router();
const driver = require("../neo4j");

router.get("/", async (req, res) => {
  const session = driver.session();
  const n = req.params.n;
  const responseList = [];
  const query = `match a=(n:UserTable)<-[c:CONTRACTS_TABLE*]-(m:UserTable) 
  where (n)<-[:CONTRACTS_TABLE]-() return a order by length(a) desc limit 1
  `;
  session
    .run(query)
    .then(function (response) {
      let result1 = {
        name: response.records[0].get("a").segments[0].start.properties.name,
        id: response.records[0].get("a").segments[0].start.properties.id.low,
      };
      responseList.push(result1);
      const result2 = {
        name: response.records[0].get("a").segments[0].end.properties.name,
        id: response.records[0].get("a").segments[0].end.properties.id.low,
      };
      responseList.push(result2);
      response.records[0].get("a").segments.forEach((element, index) => {
        if (index > 0) {
          const result = {
            name: element.end.properties.name,
            id: element.end.properties.id.low,
          };
          responseList.push(result);
        }
      });
      const resp = {
        totalChainLength: responseList.length,
        results: responseList,
      };
      res.send(resp);
    })
    .catch(function (err) {});
});

module.exports = router;
