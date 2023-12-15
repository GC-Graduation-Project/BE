const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { test } = require("../controllers");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get("/test", test);

module.exports = router;
