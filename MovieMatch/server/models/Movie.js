const mongoose = require("mongoose");

// 定义电影的数据结构
const movieSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true }, // TMDB 的电影 ID
    title: { type: String, required: true },
    poster_path: { type: String },
    release_date: { type: String },
    vote_average: { type: Number },
    overview: { type: String },
    watched: { type: Boolean, default: false }, // 默认未观看
  },
  { timestamps: true },
); // 自动记录创建和更新时间

module.exports = mongoose.model("Movie", movieSchema);
