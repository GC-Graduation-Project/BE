import puppeteer from "puppeteer";
import fs from "fs";
import multer from "multer";
import path from "path";

import Musicsheet from "../models/musicsheet.js";

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const maketab = async (req, res, next) => {
  try {
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
        const { renderSvg, vextab } = await import("../load.js");
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

    const divBoundingBox = await page.$eval("#target", (div) => {
      console.log(div.childNodes[0]);
      console.log("스캔하는중..");
      const { x, y, width, height } = div.getBoundingClientRect();
      return { x, y, width, height };
    });

    try {
      fs.readdirSync("uploads");
    } catch (error) {
      console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
      fs.mkdirSync("uploads");
    }

    const timestp = Date.now();
    const imageName = "div_screenshot" + timestp + ".png";
    const imagePath = "./uploads/" + imageName;
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

    const musicsheet = await Musicsheet.create({
      //userId: req.user.id,
      userId: "test",
      img: imageName,
      time: timestp,
    });

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
    await browser.close();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export { upload, maketab };
