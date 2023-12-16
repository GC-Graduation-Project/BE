import puppeteer from "puppeteer";
import fs from "fs";

import Musicsheet from "../models/musicsheet.js";

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

    const base64Image = encodeImageToBase64(imagePath);

    // Base64로 인코딩된 이미지를 클라이언트에게 전송
    res.status(200).json({ base64Image });

    await browser.close();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// 이미지 파일을 Base64로 인코딩하는 함수
const encodeImageToBase64 = (imagePath) => {
  try {
    // 이미지 파일을 동기적으로 읽기
    const imageData = fs.readFileSync(imagePath);

    // 이미지 데이터를 Base64로 인코딩
    const base64Image = imageData.toString("base64");

    return base64Image;
  } catch (error) {
    console.error("이미지 파일을 읽는 중 오류 발생:", error);
    throw error;
  }
};

const test = async (req, res, next) => {
  try {
    // 이미지를 Base64로 인코딩
    const base64Image = encodeImageToBase64(
      "./uploads/div_screenshot1702741606379.png"
    );

    // Base64로 인코딩된 이미지를 클라이언트에게 전송
    res.status(200).json({ base64Image });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export { maketab, test };
