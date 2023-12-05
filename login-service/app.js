const express = require("express");
const helmet = require("helmet");
const hpp = require("hpp");

const indexRouter = require("./routes");
//const { sequelize } = require("./models");

const app = express();
app.set("port", process.env.PORT || 8001);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;
