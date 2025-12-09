import express from "express";
import { createResult, listResults } from "../controllers/result.Controller.js";
import authMiddleware from "../middleware/auth.js";
const resultRouter = express.Router();
resultRouter.post("/", authMiddleware, createResult);
resultRouter.get("/", authMiddleware, listResults);
export default resultRouter;

