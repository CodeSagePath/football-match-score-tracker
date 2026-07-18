// Routes related to Team

import express from "express";
const router = express.Router();

import adminAuth from "../middleware/adminAuth.js";

import { listTeams, createTeam, deleteTeam } from "../controllers/teamController.js";

import { validateTeamCreation } from "../middleware/validation.js";

router.get("/", listTeams);
router.post("/", adminAuth, validateTeamCreation, createTeam);
router.delete("/:id", adminAuth, deleteTeam);

export { router as teamRoutes };
