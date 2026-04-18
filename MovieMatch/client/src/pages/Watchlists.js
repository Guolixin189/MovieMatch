import React, { useState, useEffect } from "react";
import {
  getAllWatchlists,
  getMoviesByListId,
  createWatchlist,
  moveMovie,
  removeFromList,
  toggleWatchedStatus,
  toggleShareWatchlist,
  renameWatchlist,
  deleteWatchlist,
} from "../utils/backendApi";

const Watchlists = () => {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const allLists = await getAllWatchlists();
      setLists(allLists);
      if (allLists.length > 0) {
        setActiveListId(allLists[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeListId) {
      fetchMovies(activeListId);
    }
  }, [activeListId]);

  const fetchMovies = async (id) => {
    try {
      const data = await getMoviesByListId(id);
      setMovies(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateList = async () => {
    const name = window.prompt("Enter new list name (e.g., Action, Sci-Fi):");
    if (!name) return;
    try {
      const newList = await createWatchlist(name);
      setLists([...lists, newList]);
      setActiveListId(newList._id);
    } catch (err) {
      alert("Failed to create list");
    }
  };

  const handleMove = async (movieId, toListId) => {
    try {
      await moveMovie(movieId, activeListId, toListId);
      fetchMovies(activeListId);
    } catch (err) {
      alert("Move failed");
    }
  };

  const handleRenameList = async (id, currentName) => {
    if (currentName === "My Watchlist") {
      alert("❌ You cannot rename the default 'My Watchlist'.");
      return;
    }

    const newName = prompt("Enter new name for the watchlist:", currentName);
    if (!newName || newName.trim() === "") return;

    try {
      await renameWatchlist(id, newName);
      alert("✅ Watchlist renamed successfully!");
      loadInitialData();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to rename watchlist.");
    }
  };

  const handleDeleteList = async (id, currentName) => {
    if (currentName === "My Watchlist") {
      alert("❌ You cannot delete the default 'My Watchlist'.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this watchlist? This action cannot be undone.",
      )
    )
      return;

    try {
      await deleteWatchlist(id);
      alert("✅ Watchlist deleted successfully!");
      loadInitialData();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete watchlist.");
    }
  };

  if (isLoading)
    return (
      <div className="h-full flex justify-center items-center text-yellow-500 font-bold">
        Loading Library...
      </div>
    );

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-slate-950 text-slate-200">
      <div className="w-full md:w-72 bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col shrink-0">
        <h2 className="text-2xl font-bold text-white mb-8 font-[Permanent_Marker] tracking-wider">
          My Library
        </h2>

        <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          {lists.map((list) => (
            <button
              key={list._id}
              onClick={() => setActiveListId(list._id)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex justify-between items-center group ${
                activeListId === list._id
                  ? "bg-yellow-500 text-slate-950 shadow-lg"
                  : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <span className="truncate">
                {list.name === "My Watchlist"
                  ? "🍿 " + list.name
                  : "📁 " + list.name}
              </span>
              <span className="text-xs opacity-60 ml-2">
                {list.movies?.length || 0}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleCreateList}
          className="mt-6 w-full border-2 border-dashed border-slate-700 hover:border-yellow-500 hover:text-yellow-500 py-3 rounded-xl font-bold transition-all text-slate-400"
        >
          + Create New List
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
        <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              {lists.find((l) => l._id === activeListId)?.name}
              <button
                onClick={async () => {
                  await toggleShareWatchlist(activeListId);
                  loadInitialData();
                }}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  lists.find((l) => l._id === activeListId)?.isPublic
                    ? "bg-green-500/20 border-green-500 text-green-400"
                    : "bg-slate-800 border-slate-600 text-slate-400"
                }`}
              >
                {lists.find((l) => l._id === activeListId)?.isPublic
                  ? "🌍 Public"
                  : "🔒 Private"}
              </button>
            </h1>
          </div>
          <span className="text-slate-500 text-sm font-bold">
            {movies.length} Movies
          </span>
        </div>

        {movies.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-600 italic">
            <span className="text-5xl mb-4">🪹</span>
            <p>This list is empty. Time to find some movies!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl transition-all hover:scale-105 flex flex-col"
              >
                <div className="aspect-[2/3] relative overflow-hidden bg-slate-900">
                  {movie.watched && (
                    <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center pointer-events-none">
                      <span className="border-2 border-green-500 text-green-500 font-black px-2 py-1 rounded rotate-12">
                        WATCHED
                      </span>
                    </div>
                  )}

                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:blur-[2px] group-hover:brightness-50 ${
                      movie.watched ? "grayscale" : ""
                    }`}
                    alt={movie.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/500x750?text=No+Poster";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                    <p className="text-xs text-slate-300 line-clamp-[8] leading-relaxed mb-2 text-shadow-sm">
                      {movie.overview || "No overview available."}
                    </p>
                  </div>

                  <div className="absolute top-2 right-2 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    {lists.length > 1 && (
                      <select
                        onChange={(e) => handleMove(movie.id, e.target.value)}
                        className="bg-slate-900/90 text-xs text-white border border-slate-600 rounded px-2 py-1 outline-none cursor-pointer hover:border-yellow-500 backdrop-blur-md"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Move to...
                        </option>
                        {lists
                          .filter((l) => l._id !== activeListId)
                          .map((l) => (
                            <option key={l._id} value={l._id}>
                              {l.name}
                            </option>
                          ))}
                      </select>
                    )}

                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() =>
                          toggleWatchedStatus(activeListId, movie.id)
                            .then(() => fetchMovies(activeListId))
                            .catch((err) => {
                              console.error(err);
                              alert("Cannot Update Watch Status");
                            })
                        }
                        className="w-8 h-8 rounded-full bg-slate-900/80 text-green-400 flex items-center justify-center border border-slate-700 hover:bg-green-500 hover:text-white transition-colors shadow-lg backdrop-blur-md"
                        title="Mark as Watched"
                      >
                        👁️
                      </button>

                      <button
                        onClick={() =>
                          removeFromList(activeListId, movie.id).then(() =>
                            fetchMovies(activeListId),
                          )
                        }
                        className="w-8 h-8 rounded-full bg-slate-900/80 text-red-400 flex items-center justify-center border border-slate-700 hover:bg-red-500 hover:text-white transition-colors shadow-lg backdrop-blur-md"
                        title="Remove"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 flex-1 flex flex-col justify-between">
                  <h3
                    className="text-sm font-bold truncate text-slate-100"
                    title={movie.title}
                  >
                    {movie.title}
                  </h3>
                  <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <span>{movie.release_date?.split("-")[0]}</span>
                    <span className="text-yellow-500">
                      ★ {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlists;
