import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { maketab } from "../controllers/index.js";

const router = express.Router();

router.post("/getSVG", maketab);

export default router;
