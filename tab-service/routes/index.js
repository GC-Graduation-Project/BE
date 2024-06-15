import express from "express";

import { maketab, name, test } from "../controllers/index.js";

const router = express.Router();

router.post("/getSVG", maketab);

router.get("/name", name);

router.post("/test", test);

export default router;
