// Match Controller - Functions to handle actual data operations related to Matches

import Match from "../models/Match";

export async function listMatches(req, res, next) {
  try {
    const matches = await Match.find({}) // empty find will list all matches - because no conditions
      .populate("team1_id team2_id");

    return res.status(200).json(matches);
  } catch (error) {
    next(error);
  }
}

export async function createMatch(req, res, next) {

  const { team1_id, team2_id } = req.body;

  try {
    const newMatch = new Match(
      {
        team1_id,
        team2_id,
        team1_score: 0,
        team2_score: 0,
      }
    );

    await newMatch.save();

    res.status(201).json(newMatch);
  } catch (error) {
    next(error);
  }
}

export async function showMatch(req, res, next) {
  const { id } = req.params;

  try {
    const match = await Match.findById(id)
      .populate("team1_id team2_id");

    if (!match) {
      return res.status(404).json({ message: "Match not found." });
    }

    return res.status(200).json(match);

  } catch (error) {
    next(error);
  }
}

export async function addGoal(req, res, next) {
  const { id } = req.params;

  const { team } = req.body;

  try {

    if(team !== "1" && team !== "2") {
      return res.status(400).json({ message: "Invalid Team." });
    }

    const update = team === "1" ? { $inc: { team1_score: 1 } } : { $inc: { team2_score: 1 } };
    const match = await Match.findByIdAndUpdate(
      id,
      update,
      { new: true },
    );

    if (!match) {
      return res.status(404).json({ message: "Match not found." });
    }

    return res.status(200).json(match);
  } catch (error) {
    next(error);
  }
}

export async function resetScore(req, res, next) {
  const { id } = req.params;

  try {
    const match = await Match.findByIdAndUpdate(
      id,
      {
        team1_score: 0,
        team2_score: 0,
      },
      { new: true });

    if (!match) {
      return res.status(404).json({ message: "Match not found." });
    }

    return res.status(200).json(match);
  } catch (error) {
    next(error);
  }
}

export async function deleteMatch(req, res, next) {
  const { id } = req.params;

  try {
    const match = await Match.findByIdAndDelete(id);

    if (!match) {
      return res.status(404).json({ message: "Match not found." });
    }

    return res.status(200).json(match);
  } catch (error) {
    next(error);
  }
}
