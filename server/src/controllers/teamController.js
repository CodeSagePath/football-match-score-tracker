// Team controller - Functions to handle actual data operations related to Teams

import Team from "../models/Team.js";
import Match from "../models/Match.js";

// GET /api/teams
export async function listTeams(req, res, next) {
  try {
    const teams = await Team.find({});
    return res.status(200).json(teams);
  } catch (error) {
    next(error);
  }
}

// POST /api/teams
export async function createTeam(req, res, next) {
  try {
    const { name } = req.body;
    const trimmedName = name.trim();

    // Check case-insensitivity for existence of a team (active or soft-deleted)
    const existingTeam = await Team.findOne({ name: trimmedName })
      .collation({ locale: "en", strength: 2 })
      .setOptions({ withDeleted: true });

    if (existingTeam) {
      if (existingTeam.deletedAt === null) {
        return res.status(400).json({ error: "Team name already exists." });
      } else {
        // Restore soft-deleted team
        existingTeam.deletedAt = null;
        await existingTeam.save();
        return res.status(200).json(existingTeam);
      }
    }

    const team = new Team({ name: trimmedName });
    await team.save();
    return res.status(201).json(team);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/teams/:id
export async function deleteTeam(req, res, next) {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    // Check if team is currently playing in an active match
    const activeMatch = await Match.findOne({
      $or: [
        { team1_id: id },
        { team2_id: id }
      ],
      matchFinishFlag: { $ne: true }
    });

    if (activeMatch) {
      return res.status(400).json({ error: "Cannot delete team while they are playing an active match." });
    }

    team.deletedAt = Date.now();
    await team.save();

    return res.status(200).json({ message: "Team Deleted Successfully." });
  } catch (error) {
    next(error);
  }
}
