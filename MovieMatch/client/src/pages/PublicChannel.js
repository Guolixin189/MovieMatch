import React, { useState, useEffect } from "react";
import { getPublicWatchlists, toggleLikeWatchlist } from "../utils/backendApi";

const PublicChannel = () => {
  const [publicLists, setPublicLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    fetchPublicLists();
  }, []);

  const fetchPublicLists = async () => {
    try {
      const data = await getPublicWatchlists();
      setPublicLists(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await toggleLikeWatchlist(id);
      fetchPublicLists(); // 刷新点赞数
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="h-full flex justify-center items-center text-yellow-500">
        Loading Community...
      </div>
    );

  return (
    <div className="h-full overflow-y-auto p-8 bg-slate-950 relative">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 font-[Permanent_Marker]">
          Community Square
        </h1>
        <p className="text-slate-400 mb-10">
          Discover what others are watching and find your next favorite list.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publicLists.map((list) => (
            <div
              key={list._id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl hover:border-yellow-500/50 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{list.name}</h2>
                  <p className="text-sm text-slate-500">
                    by{" "}
                    <span className="text-yellow-500">
                      @{list.owner?.username}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleLike(list._id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-all ${
                    list.likes?.includes(localStorage.getItem("mm_user_id"))
                      ? "bg-red-500 border-red-500 text-white"
                      : "border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-500"
                  }`}
                >
                  ❤️ {list.likes?.length || 0}
                </button>
              </div>

              <div className="flex -space-x-4 mb-6 overflow-hidden">
                {list.movies.slice(0, 4).map((movie, idx) => (
                  <img
                    key={idx}
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    className="w-16 h-24 object-cover rounded-lg border-2 border-slate-900 shadow-lg"
                    alt=""
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/200x300?text=No+Poster";
                    }}
                  />
                ))}
                {list.movies.length > 4 && (
                  <div className="w-16 h-24 bg-slate-800 rounded-lg border-2 border-slate-900 flex items-center justify-center text-xs text-slate-400 z-10">
                    +{list.movies.length - 4}
                  </div>
                )}
              </div>

              <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-500">
                  {list.movies.length} Movies
                </span>
                <button
                  onClick={() => setSelectedList(list)}
                  className="text-sm font-bold text-yellow-500 hover:underline cursor-pointer"
                >
                  View Full List →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedList(null)}
          ></div>

          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 shrink-0">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  {selectedList.name}
                </h2>
                <p className="text-slate-400 text-sm">
                  Curated by{" "}
                  <span className="text-yellow-500 font-bold">
                    @{selectedList.owner?.username}
                  </span>{" "}
                  • {selectedList.movies.length} Movies
                </p>
              </div>
              <button
                onClick={() => setSelectedList(null)}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-slate-950">
              {selectedList.movies.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 italic">
                  This list is empty.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {selectedList.movies.map((movie) => (
                    <div
                      key={movie.id}
                      className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-lg flex flex-col"
                    >
                      <div className="aspect-[2/3]">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/500x750?text=No+Poster";
                          }}
                        />
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <h3
                          className="text-sm font-bold text-white truncate mb-1"
                          title={movie.title}
                        >
                          {movie.title}
                        </h3>
                        <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-wider font-bold">
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
        </div>
      )}
    </div>
  );
};

export default PublicChannel;
