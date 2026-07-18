// Match Controller - Functions to handle actual data operations related to Matches

import Match from "../models/Match.js";
import Team from "../models/Team.js";

import { io } from "../server.js";

const populateOptions = {
  path: "team1_id team2_id",
  options: { withDeleted: true }
};

// Helper function to convert Mongoose populate data into a cleaner & flat JSON response
function formatMatch(match) {
  return {
    id: match._id,
    team1: {
      id: match.team1_id ? match.team1_id._id : null,
      name: match.team1_id ? match.team1_id.name : "Deleted Team"
    },
    team2: {
      id: match.team2_id ? match.team2_id._id : null,
      name: match.team2_id ? match.team2_id.name : "Deleted Team"
    },
    team1_score: match.team1_score,
    team2_score: match.team2_score,
    matchFinishFlag: match.matchFinishFlag,
    createdAt: match.createdAt
  };
}

// GET /api/matches
export async function listMatches(req, res, next) {
  try {
    const matches = await Match.find({}).populate(populateOptions);
    return res.status(200).json(matches.map(formatMatch));
  } catch (error) {
    next(error);
  }
}

// POST /api/matches
export async function createMatch(req, res, next) {
  const { team1_id, team2_id } = req.body;
  try {
    // Verify both teams exist
    const team1 = await Team.findById(team1_id);
    const team2 = await Team.findById(team2_id);

    if (!team1 || !team2) {
      return res.status(404).json({ error: "One or both teams not found or inactive." });
    }

    // Verify neither team is already playing in an active match
    const activeMatch = await Match.findOne({
      $or: [
        { team1_id: { $in: [team1_id, team2_id] } },
        { team2_id: { $in: [team1_id, team2_id] } },
      ],
      matchFinishFlag: { $ne: true }
    });

    if (activeMatch) {
      return res.status(400).json({ error: "One or both teams are already in an active match." });
    }

    const newMatch = new Match({
      team1_id,
      team2_id,
      team1_score: 0,
      team2_score: 0,
    });

    await newMatch.save();

    const populated = await newMatch.populate(populateOptions);
    const formattedMatch = formatMatch(populated);

    // Notify clients of a newly created match
    io.emit("matchCreated", formattedMatch);

    return res.status(201).json(formattedMatch);
  } catch (error) {
    next(error);
  }
}

// GET /api/matches/:id
export async function showMatch(req, res, next) {
  const { id } = req.params;
  try {
    const match = await Match.findById(id).populate(populateOptions);
    if (!match) {
      return res.status(404).json({ error: "Match not found." });
    }
    return res.status(200).json(formatMatch(match));
  } catch (error) {
    next(error);
  }
}

// PUT /api/matches/:id/goal (Increment score functionality)
export async function addGoal(req, res, next) {
  const { id } = req.params;
  const { team } = req.body;
  const teamStr = String(team);

  try {
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ error: "Match not found." });
    }

    if (match.matchFinishFlag) {
      return res.status(400).json({ error: "Cannot add goals to a finished match." });
    }

    if (teamStr === "1") {
      match.team1_score += 1;
    } else {
      match.team2_score += 1;
    }

    await match.save();
    const populated = await match.populate(populateOptions);

    // Adding socket event to notify clients of score change
    io.emit("goalScored", (formatMatch(populated)));

    return res.status(200).json(formatMatch(populated));
  } catch (error) {
    next(error);
  }
}

// PUT /api/matches/:id/decrement (Subtract score)
export async function decrementGoal(req, res, next) {
  const { id } = req.params;
  const { team } = req.body;
  const teamStr = String(team);

  try {
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ error: "Match not found." });
    }

    if (match.matchFinishFlag) {
      return res.status(400).json({ error: "Cannot modify score of a finished match." });
    }

    if (teamStr === "1") {
      if (match.team1_score <= 0) {
        return res.status(400).json({ error: "Score cannot go below 0." });
      }
      match.team1_score -= 1;
    } else {
      if (match.team2_score <= 0) {
        return res.status(400).json({ error: "Score cannot go below 0." });
      }
      match.team2_score -= 1;
    }

    await match.save();
    const populated = await match.populate(populateOptions);
    const formattedMatch = formatMatch(populated);

    // Notify clients of a decremented score
    io.emit("goalScored", formattedMatch);

    return res.status(200).json(formattedMatch);
  } catch (error) {
    next(error);
  }
}

// PUT /api/matches/:id/reset (Reset scores to 0-0)
export async function resetScore(req, res, next) {
  const { id } = req.params;
  try {
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ error: "Match not found." });
    }

    if (match.matchFinishFlag) {
      return res.status(400).json({ error: "Cannot reset score of a finished match." });
    }

    match.team1_score = 0;
    match.team2_score = 0;
    await match.save();

    const populated = await match.populate(populateOptions);
    const formattedMatch = formatMatch(populated);

    // Notify clients that score was reset
    io.emit("goalScored", formattedMatch);

    return res.status(200).json(formattedMatch);
  } catch (error) {
    next(error);
  }
}

// PUT /api/matches/:id/finish (Mark match as finished)
export async function finishMatch(req, res, next) {
  const { id } = req.params;
  try {
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ error: "Match not found." });
    }

    match.matchFinishFlag = true;
    await match.save();

    const populated = await match.populate(populateOptions);

    // Adding socket event to notify clients of score change
    io.emit("matchFinished", (formatMatch(populated)));

    return res.status(200).json(formatMatch(populated));
  } catch (error) {
    next(error);
  }
}

// DELETE /api/matches/:id (Soft-delete match)
export async function deleteMatch(req, res, next) {
  const { id } = req.params;
  try {
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ error: "Match not found." });
    }

    match.deletedAt = Date.now();
    await match.save();

    // Notify clients of a deleted match
    io.emit("matchDeleted", id);

    return res.status(200).json({ message: "Match deleted successfully." });
  } catch (error) {
    next(error);
  }
}
