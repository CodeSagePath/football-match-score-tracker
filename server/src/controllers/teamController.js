// Team controller - Functions to handle actual data operations related to Teams

import Team from "../models/Team.js";
import Match from "../models/Match.js";

export async function listTeams(req, res, next) {
  try {
    const teams = await Team.find({});

    if (teams.length === 0) {
      return res.status(204).json({ message: "No Match available." });
    }

    return res.status(200).json(teams);
  } catch (error) {
    next(error);
  }
}

export async function createTeam(req, res, next) {
  try {
    const { name } = req.body;

    const team = new Team({ name });

    await team.save();

    return res.status(201).json(team);
  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({ message: "Team name already exists." });
    }

    next(error);
  }
}

export async function deleteTeam(req, res, next) {
  try {
    const { id } = req.params;

    const activeMatch = await Match.findOne({
      $or: [
        { team1_id: id },
        { team2_id: id }
      ],
      matchFinishFlag: false,
    });

    if (activeMatch) {
      return res.status(400).json({ message: "Cannot delete team while they are playing an active match." })
    }

    await Team.findByIdAndUpdate(id, {
      deletedAt: Date.now(),
    });

    return res.status(200).json({ message: "Team Deleted Successfully." })
  } catch (error) {
    next(error);
  }
}
