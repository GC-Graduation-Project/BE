const express = require("express");
const httpProxy = require("http-proxy");
const cors = require("cors");

const app = express();
const proxy = httpProxy.createProxyServer();

// 예제 마이크로서비스 엔드포인트
const loginURL = "http://localhost:8001";
const cameraURL = "http://localhost:8002";
const imageURL = "http://localhost:8003";
const sourceURL = "http://localhost:8004";
const tabURL = "http://localhost:8005";

app.set("port", process.env.PORT || 8000);

app.use(cors());

app.all("/login/*", (req, res) => {
  req.url = req.url.replace("/login", ""); // '/login'을 제거
  proxy.web(req, res, { target: loginURL });
});
app.all("/camera/*", (req, res) => {
  req.url = req.url.replace("/camera", "");
  proxy.web(req, res, { target: cameraURL });
});
app.all("/image/*", (req, res) => {
  req.url = req.url.replace("/image", "");
  proxy.web(req, res, { target: imageURL });
});
app.all("/source/*", (req, res) => {
  req.url = req.url.replace("/source", "");
  proxy.web(req, res, { target: sourceURL });
});
app.all("/tab/*", (req, res) => {
  req.url = req.url.replace("/tab", "");
  proxy.web(req, res, { target: tabURL });
});

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  logger.error(error.message);
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;
