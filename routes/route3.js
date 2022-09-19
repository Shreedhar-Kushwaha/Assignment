const express = require("express");
const router = express.Router();
const driver = require("../neo4j");

router.get("/:n", async (req, res) => {
  const session = driver.session();
  const n = req.params.n;
  const responseList = [];
  const query = `match(u:UserTable)<-[c:CONTRACTS_TABLE]-(t:UserTable)
  return u.name as LenderName,
    count(u) as TotalBorrower order by TotalBorrower limit ${n}`;
  session
    .run(query)
    .then(function (response) {
      response.records.forEach((element) => {
        console.log(element);
        const result = {
          user: element.get("LenderName"),
          totalBorrower: element.get("TotalBorrower").low,
        };
        responseList.push(result);
      });
      const resp = {
        totalResult: responseList.length,
        results: responseList,
      };
      res.send(resp);
    })
    .catch(function (err) {});
});

module.exports = router;
