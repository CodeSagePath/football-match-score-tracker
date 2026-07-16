import express from "express";
const router = express.Router();

import { listMatches, createMatch, showMatch, addGoal, resetScore, deleteMatch } from "../controllers/matchController.js";
import { validateMatchCreation, validateGoalRequest } from "../middleware/validation.js";

router.get("/", listMatches);
router.post("/", validateMatchCreation, createMatch);
router.get("/:id", showMatch);
router.put("/:id/goal", validateGoalRequest, addGoal);
router.put("/:id/reset", resetScore);
router.delete("/:id", deleteMatch);

export { router as matchRoutes };
