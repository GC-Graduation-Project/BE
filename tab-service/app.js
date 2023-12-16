import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";

import indexRouter from "./routes/index.js";
import db from "./models/index.js";

//dir_name 을 사용하기 위함
const __dirname = fileURLToPath(new URL(".", import.meta.url));
// const __filename = fileURLToPath(import.meta.url);

const app = express();

app.use(
  cors({
    origin: "http://localhost:8005", // 접근 권한을 부여하는 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200으로 설정
  })
);

//req.body 사용하기 위한 bodyParser
app.use(express.text({ type: "text/plain" }));

//포트 설정
app.set("port", process.env.PORT || 8005);
db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

//브라우저에서 필요한 js 파일들을 사용할수 있게 해줌
app.use("/load.js", express.static(__dirname + "/load.js"));
app.use("/main.dev.js", express.static(__dirname + "/main.dev.js"));
app.use("/jspdf", express.static(__dirname + "/node_modules/"));

app.get("/vextabhtml", (req, res) => {
  res.sendFile(__dirname + "/load.html");
});

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

export default app;
