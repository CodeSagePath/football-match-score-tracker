// Match Model

import mongoose from "mongoose";

const { Schema, Types, model } = mongoose;

const matchSchema = new Schema(
  {
    team1_id: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      validate: {
        validator: function (value) {
          return !value.equals(this.team2_id);
        },
        message: "A team cannot play against itself",
      }
    },
    team2_id: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    team1_score: {
      type: Number,
      default: 0,
    },
    team2_score: {
      type: Number,
      default: 0,
    },
    matchFinishFlag: {
      type: Boolean,
      default: false,
    }, 
    deletedAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

const Match = model("Match", matchSchema);

export default Match;
