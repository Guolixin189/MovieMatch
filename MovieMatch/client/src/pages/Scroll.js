import React, { useState, useEffect } from "react";
import axios from "axios";
import { addToWatchlist } from "../utils/backendApi";

const TMDB_API_KEY = "cfc38c3e9ea356a10f7796e40c13efe0";

const ScrollMovieCard = ({ movie }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [details, setDetails] = useState(null);

  const handleFlip = async () => {
    if (!isFlipped && !details) {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=credits&api_key=${TMDB_API_KEY}`,
        );
        setDetails(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    setIsFlipped(!isFlipped);
  };

  const handleAdd = async (e) => {
    e.stopPropagation();
    try {
      const movieToSave = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      };
      await addToWatchlist(movieToSave);
      alert("✅ Added to Watchlist!");
    } catch (error) {
      if (error.response?.status === 400) alert("😅 Already in Watchlist!");
    }
  };

  return (
    <div
      className="relative w-full aspect-[2/3] cursor-pointer group"
      style={{ perspective: "1000px" }}
      onClick={handleFlip}
    >
      <div
        className="w-full h-full transition-transform duration-700 relative shadow-lg rounded-xl"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full rounded-xl overflow-hidden bg-slate-800"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white font-bold text-sm truncate w-full text-center">
              Click to Flip ↺
            </span>
          </div>
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full rounded-xl bg-slate-900 border border-slate-700 p-4 flex flex-col overflow-y-auto no-scrollbar"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <h3 className="font-bold text-slate-100 text-sm mb-2">
            {movie.title}
          </h3>
          {details ? (
            <div className="text-xs text-slate-300 space-y-2 flex-1">
              <p>
                <span className="text-yellow-500 font-bold">Dir:</span>{" "}
                {details.credits?.crew?.find((c) => c.job === "Director")
                  ?.name || "N/A"}
              </p>
              <p>
                <span className="text-yellow-500 font-bold">Cast:</span>{" "}
                {details.credits?.cast
                  ?.slice(0, 3)
                  .map((c) => c.name)
                  .join(", ")}
              </p>
              <p className="line-clamp-6 text-slate-400 mt-2 border-t border-slate-800 pt-2">
                {details.overview}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex justify-center items-center text-xs text-slate-500 animate-pulse">
              Loading...
            </div>
          )}
          <button
            onClick={handleAdd}
            className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg text-xs transition-transform active:scale-95"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

// const Scroll = () => {
//   const [movies, setMovies] = useState([]);
//   useEffect(() => {
//     const fetchMovies = async () => {
//       const response = await axios.get(
//         `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&page=2&api_key=${TMDB_API_KEY}`,
//       );
//       setMovies(response.data.results);
//     };
//     fetchMovies();
//   }, []);

//   return (
//     <div className="h-full overflow-y-auto p-6 scroll-smooth">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-2">
//           Discover New Movies
//         </h2>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//           {movies.map((movie) => (
//             <ScrollMovieCard key={movie.id} movie={movie} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Scroll;

const Scroll = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);

        const prefsString = localStorage.getItem("mm_prefs");
        const prefs = prefsString ? JSON.parse(prefsString) : {};

        let fetchUrl = "";

        if (prefs.natural && prefs.natural.trim() !== "") {
          fetchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(prefs.natural)}&api_key=${TMDB_API_KEY}`;
        } else {
          fetchUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${TMDB_API_KEY}`;

          if (prefs.genre) fetchUrl += `&with_genres=${prefs.genre}`;
          if (prefs.year) {
            fetchUrl += `&primary_release_date.gte=${prefs.year}-01-01`;
          }
          if (prefs.rating) fetchUrl += `&vote_average.gte=${prefs.rating}`;
        }

        const response = await axios.get(fetchUrl);
        setMovies(response.data.results);
      } catch (error) {
        console.error("Fetch Scroll Movies Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-yellow-500 text-xl font-bold">
        <div className="animate-pulse">Loading Your Preferences...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 scroll-smooth">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-2">
          Discover New Movies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <ScrollMovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Scroll;
