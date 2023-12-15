import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";
import puppeteer from "puppeteer";
import fs from "fs";
import { sequelize } from './models/index.js';
import {db} from './models/index.js'
const { vextab} = db;

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

//브라우저에서 필요한 js 파일들을 사용할수 있게 해줌
app.use("/load.js", express.static(__dirname + "/load.js"));
app.use("/main.dev.js", express.static(__dirname + "/main.dev.js"));
app.use("/jspdf", express.static(__dirname + "/node_modules/"));

app.get("/vextabhtml", (req, res) => {
  res.sendFile(__dirname + "/load.html");
});

app.post("/getSVG", (req, res) => {
  var imagePath
  var imageTime
  var imageName

  (async () => {
    const notedata = req.body;

    console.log("frombody", notedata);
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("http://localhost:8005/vextabhtml");
    page.on("console", (msg) => console.log("페이지 로그:", msg.text()));

    const target = page.$("target");

    const result = await page.evaluate(
      async (notedata, target) => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        // console.log('추가스크립트')
        const { renderSvg, vextab } = await import("./load.js");
        var isRendered = renderSvg(vextab, notedata, target);
        console.log("랜더링중");
        new Promise((page) => setTimeout(page, 5000));

        if (isRendered) {
          console.log("랜더링 완료");
        } else {
          console.log("랜더링 실패 (vextab error)");
        }

        return isRendered;
      },
      notedata,
      target
    );

    // console.log(result)
    if (result) {
      // Get the bounding box of the div
      const divBoundingBox = await page.$eval("#target", (div) => {
        console.log(div.childNodes[0]);
        console.log("스캔하는중..");
        const { x, y, width, height } = div.getBoundingClientRect();
        return { x, y, width, height };
      });

      imageTime = Date.now()
      imageName = "div_screenshot"+imageTime+".png"
      imagePath = "./images/"+imageName;
      // Capture the screenshot of the div
      await page.screenshot(
        {
          path: imagePath,
          clip: {
            x: divBoundingBox.x,
            y: divBoundingBox.y,
            width: divBoundingBox.width,
            height: divBoundingBox.height,
          },
        },
        console.log("스캔완료")
      );

      // 이미지를 읽어서 전송
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
        // 이미지 전송
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(data);
      });
    } else {
      console.log("render failed");
      res.send(
        "Rendering faild. check your note data is correct or find out what occurred the error"
      );
    }
    await browser.close();

    //DB 로 전송하는 부분
    //데이터베이스에 연결
    var isCreated
    await sequelize
        .sync( { force: true }) //true면 테이블 계속 재생성
        .then(() => {          
               console.log('데이터베이스 연결 성공');  
          })
        .catch((err) => {
               console.error(err);
          });
          
    //트랜젝션 생성
    const transaction = await sequelize.transaction()
  
    try{
     await vextab.create({
      idvextab : 1,
      member_id : 1,
      img_name : imageName,
      img_time : imageTime,
      img_path : imagePath,
     },{transaction})
  
     //트랜잭션 커밋
     await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.log(error)
    }
  
     
      
  })();
});

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
function createUser(vextab,imageName,imageTime,imagePath) {
  try {


    // Insert a new user into the Users table
        vextab.create({
     idvextab : 1,
     member_id : 1,
     img_name : imageName,
     img_time : imageTime,
     img_path : imagePath,
    });

    new Promise((resolve) => setTimeout(resolve, 5000));
    

   
    // console.log('New user created:', newUser.toJSON());
  
  } catch (error) {
     console.error('Unable to create a new user:', error);
    
     
  } finally {
     return true
     // Close the database connection
  }
  
}

export default app;
