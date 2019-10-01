const express = require("express");
const router = express.Router();

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
};

const checkRole = roles => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }
    return res.redirect("/");
  };
};

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Home", user: req.user });
});

router.get(
  "/dashboard",
  isAuth,
  checkRole(["boss", "TA"]),
  (req, res, next) => {
    res.render("dashboard", { title: "dashboard", user: req.user });
  }
);

module.exports = router;
