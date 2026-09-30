import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/api",
});

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

export const signup = async (username, password) => {
  const response = await api.post("/auth/signup", { username, password });
  return response.data;
};

export const login = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export const getAllWatchlists = async () => {
  const response = await api.get("/watchlists");
  return response.data;
};

export const createWatchlist = async (name) => {
  const response = await api.post("/watchlists", { name });
  return response.data;
};

export const getMoviesByListId = async (listId) => {
  const response = await api.get(`/watchlists/${listId}`);
  return response.data;
};

export const addToWatchlist = async (movie) => {
  const response = await api.post("/watchlist", movie);
  return response.data;
};

export const moveMovie = async (movieId, fromListId, toListId) => {
  const response = await api.post("/watchlists/move", {
    movieId,
    fromListId,
    toListId,
  });
  return response.data;
};

export const toggleWatchedStatus = async (listId, movieId) => {
  const response = await api.put(
    `/watchlists/${listId}/movies/${movieId}/watched`,
  );
  return response.data;
};

export const removeFromList = async (listId, movieId) => {
  const response = await api.delete(`/watchlists/${listId}/movie/${movieId}`);
  return response.data;
};

export const getPublicWatchlists = async () => {
  const response = await api.get("/community/watchlists");
  return response.data;
};

export const toggleShareWatchlist = async (listId) => {
  const response = await api.put(`/watchlists/${listId}/share`);
  return response.data;
};

export const toggleLikeWatchlist = async (listId) => {
  const response = await api.put(`/community/watchlists/${listId}/like`);
  return response.data;
};

export const renameWatchlist = async (id, name) => {
  const response = await api.put(`/watchlists/${id}/rename`, { name });
  return response.data;
};

export const deleteWatchlist = async (id) => {
  const response = await api.delete(`/watchlists/${id}`);
  return response.data;
};
