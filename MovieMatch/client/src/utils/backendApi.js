import axios from "axios";

const api = axios.create({
  baseURL: "http://3.16.67.55/api",
});

// 🛡️ 请求拦截器：自动带上 Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mm_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ==========================================
// 📁 清单管理接口 (Watchlist Management)
// ==========================================

/**
 * 获取当前用户所有的清单（包括名字、ID和电影数量概览）
 */
export const getAllWatchlists = async () => {
  const response = await api.get("/watchlists");
  return response.data;
};

/**
 * 新建一个自定义清单
 * @param {string} name - 清单名称
 */
export const createWatchlist = async (name) => {
  const response = await api.post("/watchlists", { name });
  return response.data;
};

/**
 * 获取特定清单内的所有电影详细内容
 * @param {string} listId - 清单的数据库 ID (_id)
 */
export const getMoviesByListId = async (listId) => {
  const response = await api.get(`/watchlists/${listId}`);
  return response.data;
};

// ==========================================
// 🎬 电影操作接口 (Movie Operations)
// ==========================================

/**
 * 默认添加：将电影存入默认的 "My Watchlist" (用于 Swipe/Scroll 模式)
 * @param {object} movie - 减肥后的电影对象 { id, title, poster_path, ... }
 */
export const addToWatchlist = async (movie) => {
  const response = await api.post("/watchlist", movie);
  return response.data;
};

/**
 * 跨清单移动：将电影从 A 文件夹转移到 B 文件夹
 * @param {number} movieId - 电影的 TMDB ID
 * @param {string} fromListId - 来源清单 ID
 * @param {string} toListId - 目标清单 ID
 */
export const moveMovie = async (movieId, fromListId, toListId) => {
  const response = await api.post("/watchlists/move", {
    movieId,
    fromListId,
    toListId,
  });
  return response.data;
};

/**
 * 切换观看状态：标记已看或未看
 * @param {number} movieId - 电影的 TMDB ID
 */
export const toggleWatchedStatus = async (movieId) => {
  const response = await api.put(`/watchlist/${movieId}`);
  return response.data;
};

/**
 * 从特定清单中移除电影
 * @param {string} listId - 清单 ID
 * @param {number} movieId - 电影的 TMDB ID
 */
export const removeFromList = async (listId, movieId) => {
  const response = await api.delete(`/watchlists/${listId}/movie/${movieId}`);
  return response.data;
};

export const getPublicWatchlists = async () => {
  const response = await api.get("/community/watchlists");
  return response.data;
};

// 切換清單的公開/私密狀態
export const toggleShareWatchlist = async (listId) => {
  const response = await api.put(`/watchlists/${listId}/share`);
  return response.data;
};

// 點讚或取消點讚
export const toggleLikeWatchlist = async (listId) => {
  const response = await api.put(`/community/watchlists/${listId}/like`);
  return response.data;
};
