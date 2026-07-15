// Validation Middleware - Team creation, match creation & goal request

import mongoose from "mongoose";

export function validateTeamCreation(req, res, next) {
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Team name required" });
  }

  next();
}

export function validateMatchCreation(req, res, next) {
  const { team1_id, team2_id } = req.body;

  if (!team1_id || !team2_id || !mongoose.Types.ObjectId.isValid(team1_id) || !mongoose.Types.ObjectId.isValid(team2_id) || team1_id === team2_id) {
    return res.status(400).json({ error: "Invalid match data" });
  }

  next();
}

export function validateGoalRequest(req, res, next) {
  const { team } = req.body;

  if (!team || team !== "1" && team !== "2") {
    return res.status(400).json({ error: "invalid Team" });
  }

  next();
}
