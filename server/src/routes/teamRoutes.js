import express from "express";
const teamRoutes = express.Router();

import { listTeams, createTeam, deleteTeam } from "../controllers/teamController.js";

import { validateTeamCreation } from "../middleware/validation.js";

router.get("/", listTeams);
router.post("/", validateTeamCreation, createTeam);
router.delete("/:id", deleteTeam);

export default teamRoutes;
