// Team Model

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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

const Team = model("Team", teamSchema);

export default Team;
