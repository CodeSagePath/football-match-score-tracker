// Team controller - Functions to handle actual data operations related to Teams

import Team from "../models/Team.js";
import Match from "../models/Match.js";

// GET /api/teams
export async function listTeams(req, res, next) {
  try {
    const teams = await Team.find({ deletedAt: null }); // Return teams that are not soft-deleted

    if (!teams || teams.length === 0) {
      return res.status(204).json({ message: "No Team available." });
    }

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

    // Check case-insensitivity for existence of a team
    const existingTeam = await Team.findOne({
      name: new RegExp(`^${trimmedName}$`, "i")
    });

    if (existingTeam) {
      if (existingTeam.deletedAt === null) {

        // If team is active, retrun an error
        return res.status(400).json({ error: "Team name already exists." });
      } else {

        // If team was soft-deleted, restore it by setting deletedAt to null
        existingTeam.deletedAt = null;
        await existingTeam.save();
        return res.status(200).json(existingTeam); // Returns the restored team
      }
    }

    // Create a new team if it doesn't exist
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

    // Check if the team exists in the database
    const team = await Team.findOne({
      _id: id,
      deletedAt: null
    })

    if(!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    // Check if team is currently playing in an active match
    // $ne: true finds matches where `matchFinishFlag` is false or does not exist

    const activeMatch = await Match.findOne({
      $or: [
        { team1_id: id },
        { team2_id: id }
      ],
      matchFinishFlag: { $ne: true }
    });

    if (activeMatch) {
      return res.status(400).json({ message: "Cannot delete team while they are playing an active match." })
    }

    // Soft-delete the team by setting the deletedAt timestamp
    team.deletedAt = Date.now();
    await team.save();

    return res.status(200).json({ message: "Team Deleted Successfully." })
  } catch (error) {
    next(error);
  }
}
