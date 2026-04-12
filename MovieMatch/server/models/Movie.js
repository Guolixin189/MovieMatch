const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    poster_path: { type: String },
    release_date: { type: String },
    vote_average: { type: Number },
    overview: { type: String },
    watched: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Movie", movieSchema);
