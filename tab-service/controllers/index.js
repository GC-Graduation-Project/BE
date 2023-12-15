const multer = require("multer");
const path = require("path");
const vextab = require("vextab");
const puppeteer = require("puppeteer");
const { JSDOM } = require("jsdom");

/*
exports.tab = async (req, res, next) => {
  try {
    //const data = req.body.tabData;
    const data = `
    tabstave notation=true key=A time=4/4

    notes :q =|: (5/2.5/3.7/4) :8 7-5h6/3 ^3^ 5h6-7/5 ^3^ :q 7V/4 |
    notes :8 t12p7/4 s5s3/4 :8 3s:16:5-7/5 :q p5/4
    text :w, |#segno, ,|, :hd, , #tr
    `;

    const VF = vextab.Vex.Flow;

    // Create a fake browser environment using jsdom
    const { window } = new jsdom.JSDOM();
    global.window = window;
    global.document = window.document;

    // Initialize VexTab artist and parser.
    const artist = new vextab.Artist(10, 10, 750, { scale: 0.8 });
    const tab = new vextab.VexTab(artist);

    tab.parse(data);

    // Get the SVG content
    const svgContent = artist.renderToStave();

    // Specify the upload folder path
    const uploadFolderPath = path.join(__dirname, "upload");

    // Ensure the upload folder exists
    if (!fs.existsSync(uploadFolderPath)) {
      fs.mkdirSync(uploadFolderPath);
    }

    // Save the SVG content to the file using the original filename
    const fileName = req.file.filename + ".svg";
    const svgFilePath = path.join(uploadFolderPath, fileName);
    fs.writeFileSync(svgFilePath, svgContent);

    // Convert SVG to PNG using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const fileUrl = "file://" + svgFilePath;
    await page.goto(fileUrl, { waitUntil: "networkidle2" });
    await page.screenshot({
      path: path.join(uploadFolderPath, req.file.filename + ".png"),
    });
    await browser.close();

    // Clean up the fake browser environment
    delete global.window;
    delete global.document;

    // Send a response to the client
    res.status(200).json({ message: "Tab data saved successfully." });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
*/
