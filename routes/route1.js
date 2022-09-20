const express = require("express");
const driver = require("../neo4j");
const router = express.Router();

router.get("/:n", async (req, res) => {
  const session = driver.session();
  const n = req.params.n;
  const responseList = [];
  const query = `match(u:UserTable)<-[c:CONTRACTS_TABLE]-(t:UserTable)
   with u,t,c, count(u) as cnt where cnt>=${n} return u.name as LenderName,
   sum(c.principle) as Total`;

  await session
    .run(query)
    .then(function (response) {
      response.records.forEach((element) => {
        const result = {
          user: element.get("LenderName"),
          totalAmount: element.get("Total"),
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
