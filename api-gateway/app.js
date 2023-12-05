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

app.use(cors());

app.all("/login/*", (req, res) => {
  req.url = req.url.replace("/login", ""); // '/login'을 제거
  proxy.web(req, res, { target: loginURL });
});

// 게이트웨이 서버의 포트
const gatewayPort = 8000;

// 게이트웨이 서버 시작
app.listen(gatewayPort, () => {
  console.log(`Gateway server is running at http://localhost:${gatewayPort}`);
});
