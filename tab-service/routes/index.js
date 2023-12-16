import express from "express";

import { maketab, test } from "../controllers/index.js";

const router = express.Router();

router.post("/getSVG", maketab);
router.post("/test", test);

export default router;
