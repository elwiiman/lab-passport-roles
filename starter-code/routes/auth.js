const express = require("express");
const router = express.Router();
const passport = require("../helpers/passport");
const User = require("../models/User");

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

//ROUTES FOR SIGNUP

router.get("/signup", isAuth, checkRole(["boss"]), (req, res) => {
  res.render("auth/signup", { title: "signup" });
});

router.post("/signup", (req, res) => {
  let { email, password, role } = req.body;
  let error;
  console.log(email);

  if (!email || !password) {
    error = "You should type both: email and password";
    return res.render("auth/signup", { title: "signup", error });
  }

  User.findByUsername(email).then(user => {
    if (user) {
      error = "User email already exists in DB";
      res.render("auth/signup", { title: "signup", error });
    } else {
      console.log("New user incoming....");
      User.register({ email, role }, password)
        .then(user => {
          req.login(user, err => {
            res.redirect("/");
          });
          console.log("New user created successfully");
        })
        .catch(error => {
          res.render("auth/signup", { title: "signup", error });
        });
    }
  });
});

//ROUTES FOR LOGIN
router.get("/login", (req, res) => {
  res.render("auth/login", { title: "login", user: req.user });
});

router.post("/login", (req, res) => {
  passport.authenticate("local", (err, user, info = {}) => {
    const { message: error } = info;
    if (error) {
      console.log(err, user, info);
      return res.render("auth/login", { title: "login", error });
    }
    req.login(user, err => {
      res.redirect("/dashboard");
    });
  })(req, res);
});

//ROUTE LOGOUT
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
