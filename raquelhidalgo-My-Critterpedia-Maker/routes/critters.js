const router = require("express").Router();

/* GET critters page */
router.get("/critters", (req, res, next) => {
  res.render("critters");
});

module.exports = router;
