// Team Model

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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

// Define case-insensitive unique index only on active (non-deleted) teams
teamSchema.index(
  { name: 1 },
  {
    unique: true,
    collation: { locale: "en", strength: 2 },
    partialFilterExpression: { deletedAt: null }
  }
);

// Pre-query middleware to filter out soft-deleted teams
teamSchema.pre(/^find/, function () {
  if (this.getOptions().withDeleted) {
    return;
  }
  this.where({ deletedAt: null });
});

const Team = model("Team", teamSchema);

export default Team;
