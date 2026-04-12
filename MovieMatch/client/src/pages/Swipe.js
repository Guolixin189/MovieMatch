import React, { useState, useEffect } from "react";
import axios from "axios";
import { addToWatchlist } from "../utils/backendApi";

const TMDB_API_KEY = "cfc38c3e9ea356a10f7796e40c13efe0";

const Swipe = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${TMDB_API_KEY}`,
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    setIsFlipped(false);
    setMovieDetails(null);
  }, [currentIndex]);

  const handleFlip = async () => {
    if (!isFlipped && !movieDetails) {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${currentMovie.id}?append_to_response=credits&api_key=${TMDB_API_KEY}`,
        );
        setMovieDetails(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    setIsFlipped(!isFlipped);
  };

  const handleAction = async (actionType) => {
    if (!currentMovie) return;

    if (actionType === "save") {
      try {
        // 🌟 核心修复：数据减肥，只传后端需要的字段，避免 413 错误！
        const movieToSave = {
          id: currentMovie.id, // 必须叫 id
          title: currentMovie.title,
          poster_path: currentMovie.poster_path,
          overview: currentMovie.overview,
          release_date: currentMovie.release_date,
          vote_average: currentMovie.vote_average,
        };
        await addToWatchlist(movieToSave);
      } catch (error) {
        if (error.response?.status === 400)
          alert("😅 这部电影已经在你的收藏夹里啦！");
      }
    }
    setCurrentIndex((prev) => prev + 1);
  };

  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center text-yellow-500">
        Loading...
      </div>
    );
  if (!currentMovie)
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        You've seen them all!
      </div>
    );

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div
        className="relative w-full max-w-sm aspect-[2/3] cursor-pointer group"
        style={{ perspective: "1000px" }}
        onClick={handleFlip}
      >
        <div
          className="w-full h-full transition-transform duration-700 relative shadow-2xl rounded-2xl"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* 正面 */}
          <div
            className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden bg-slate-800"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
              alt={currentMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
              <h2 className="text-3xl font-bold text-white text-center font-[Permanent_Marker] tracking-wide">
                {currentMovie.title}
              </h2>
            </div>
          </div>
          {/* 背面 */}
          <div
            className="absolute top-0 left-0 w-full h-full rounded-2xl bg-slate-900 border border-slate-700 p-6 flex flex-col overflow-y-auto no-scrollbar"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentMovie.title}
            </h2>
            <div className="flex justify-between text-xs text-slate-400 mb-4 pb-4 border-b border-slate-800">
              <span>📅 {currentMovie.release_date}</span>
              <span className="text-yellow-500 font-bold">
                ⭐ {currentMovie.vote_average?.toFixed(1)}
              </span>
            </div>
            {movieDetails ? (
              <div className="text-sm text-slate-300 space-y-3 mb-4 flex-1">
                <p>
                  <strong className="text-yellow-500">Director:</strong>{" "}
                  {movieDetails.credits?.crew?.find((c) => c.job === "Director")
                    ?.name || "N/A"}
                </p>
                <p>
                  <strong className="text-yellow-500">Cast:</strong>{" "}
                  {movieDetails.credits?.cast
                    ?.slice(0, 4)
                    .map((c) => c.name)
                    .join(", ") || "N/A"}
                </p>
                <p className="leading-relaxed border-t border-slate-800 pt-3">
                  {movieDetails.overview}
                </p>
              </div>
            ) : (
              <div className="flex-1 flex justify-center items-center text-slate-500 text-sm animate-pulse">
                Loading details...
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction("save");
              }}
              className="w-full mt-auto bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 z-10"
            >
              + Add to Watchlist
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-8 mt-8">
        <button
          onClick={() => handleAction("skip")}
          className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-red-500 text-3xl hover:bg-slate-700 hover:scale-110 shadow-xl"
        >
          ❌
        </button>
        <button
          onClick={() => handleAction("save")}
          className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-green-500 text-3xl hover:bg-slate-700 hover:scale-110 shadow-xl"
        >
          💚
        </button>
      </div>
    </div>
  );
};

export default Swipe;
