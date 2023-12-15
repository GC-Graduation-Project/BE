const express = require("express");
const multer = require("multer");
const path = require("path");
const puppeteer = require("puppeteer");

//const { tab } = require("../controllers");

const router = express.Router();

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

//router.post("/tab", upload.single("img"), tab);

router.post("/getSVG", (req, res) => {
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

      // Capture the screenshot of the div
      await page.screenshot(
        {
          path: "div_screenshot.png",
          clip: {
            x: divBoundingBox.x,
            y: divBoundingBox.y,
            width: divBoundingBox.width,
            height: divBoundingBox.height,
          },
        },
        console.log("스캔완료")
      );

      const imagePath = "div_screenshot.png";

      // 이미지를 읽어서 전송
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }

        // 이미지 전송
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(data);
      });
    } else {
      console.log("render failed");
      res.send(
        "Rendering faild. check your note data is correct or find out what occurred the error"
      );
    }
    await browser.close();
  })();
});

module.exports = router;
