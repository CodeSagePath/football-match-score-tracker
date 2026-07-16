// Routes related to Match

import express from "express";
const router = express.Router();

import { listMatches, createMatch, showMatch, addGoal, decrementGoal, resetScore, finishMatch, deleteMatch } from "../controllers/matchController.js";
import { validateMatchCreation, validateGoalRequest } from "../middleware/validation.js";

router.get("/", listMatches);
router.post("/", validateMatchCreation, createMatch);
router.get("/:id", showMatch);
router.put("/:id/goal", validateGoalRequest, addGoal);
router.put("/:id/decrement", validateGoalRequest, decrementGoal);
router.put("/:id/reset", resetScore);
router.put("/:id/finish", finishMatch);
router.delete("/:id", deleteMatch);

export { router as matchRoutes };
