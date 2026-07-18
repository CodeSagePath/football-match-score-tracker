// Routes related to Match

import express from "express";
const router = express.Router();

import adminAuth from "../middleware/adminAuth.js";

import { listMatches, createMatch, showMatch, addGoal, decrementGoal, resetScore, finishMatch, deleteMatch } from "../controllers/matchController.js";
import { validateMatchCreation, validateGoalRequest } from "../middleware/validation.js";

router.get("/", listMatches);
router.post("/", adminAuth, validateMatchCreation, createMatch);
router.get("/:id", showMatch);
router.put("/:id/goal", adminAuth, validateGoalRequest, addGoal);
router.put("/:id/decrement", adminAuth, validateGoalRequest, decrementGoal);
router.put("/:id/reset", adminAuth, resetScore);
router.put("/:id/finish", adminAuth, finishMatch);
router.delete("/:id", adminAuth, deleteMatch);

export { router as matchRoutes };
