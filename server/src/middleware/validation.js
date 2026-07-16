// Validation Middleware - Team creation, match creation & goal request

import mongoose from "mongoose";

// function to check if team name is provided
export function validateTeamCreation(req, res, next) {
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Team name required." });
  }

  next();
}

// check if both teams are valid ObjectIDs and not the same team
export function validateMatchCreation(req, res, next) {
  const { team1_id, team2_id } = req.body;

  const isValidTeam1 = mongoose.Types.ObjectId.isValid(team1_id);
  const isValidTeam2 = mongoose.Types.ObjectId.isValid(team2_id);

  if (!team1_id || !team2_id || !isValidTeam1 || !isValidTeam2 || team1_id === team2_id) {
    return res.status(400).json({ error: "Invalid team IDs." });
  }

  next();
}

// check if team selection is either "1" or "2"
export function validateGoalRequest(req, res, next) {
  const { team } = req.body;

  // handling number 1 and string "1" alike
  const teamString = String(team);

  if (teamString !== "1" && teamString !== "2") {
    return res.status(400).json({ error: "Invalid Team. Must be \"1\" or \"2\". " });
  }

  next();
}
