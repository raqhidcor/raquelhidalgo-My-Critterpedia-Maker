const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
/* GET profile page */
router.get("/profile", isLoggedIn, (req, res, next) => {
  const loggedUser = req.session.loggedUser;
  res.render("profile", { loggedUser });
});

module.exports = router;
