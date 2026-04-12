import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ListVideo, Layers, Grid } from "lucide-react";
import Watchlist from "../pages/Watchlists";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const Home = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    natural: "",
    genre: "",
    rating: "1",
    year: "2000",
  });
  const [mode, setMode] = useState("swipe");

  // 👉 新增：控制 Watchlist 的状态和数量角标
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);

  // 👉 新增：获取最新数量的函数
  const updateWatchlistCount = () => {
    const list = JSON.parse(localStorage.getItem("mm_watchlist") || "[]");
    setWatchlistCount(list.length);
  };

  // 👉 新增：页面加载时获取一次数量
  useEffect(() => {
    updateWatchlistCount();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("mm_prefs", JSON.stringify(formData));

    if (mode === "swipe") {
      navigate("/swipe");
    } else {
      navigate("/scroll");
    }
  };

  return (
    <div className="bg-slate-900 text-white font-sans min-h-screen overflow-hidden relative">
      <header className="fixed top-0 left-0 w-full z-40 p-4 flex justify-between items-center shadow-md bg-slate-900/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="font-[Permanent_Marker] text-2xl text-yellow-400 hidden sm:block drop-shadow-md">
            MovieMatch
          </h1>
        </Link>
        <button
          onClick={() => setIsWatchlistOpen(true)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
        >
          <ListVideo size={20} />
          <span className="hidden md:inline">Watchlist</span>
          <span className="bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {watchlistCount}
          </span>
        </button>
      </header>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-6 w-full">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1661420328803-88ad79e74286?w=900&auto=format&fit=crop&q=60')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-pink-500/50 blur-xl"></div>

            <h2 className="text-4xl font-[Permanent_Marker] text-center mb-2 text-white drop-shadow-md">
              Find Your Movie!
            </h2>
            <p className="text-center text-slate-200 mb-6 text-sm">
              Enter preferences: actors, mood, trending...
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-yellow-200 text-xs font-bold uppercase tracking-widest ml-1">
                  Search by Name
                </label>
                <input
                  name="natural"
                  value={formData.natural}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Inception..."
                  className="w-full p-4 rounded-xl bg-white/5 border border-slate-600 focus:border-yellow-400 focus:outline-none text-white"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-yellow-200 text-xs font-bold uppercase tracking-widest ml-1">
                    Genre
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-600 text-white cursor-pointer focus:outline-none"
                  >
                    <option value="">Any Genre</option>
                    {GENRES.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 space-y-2">
                  <label className="text-yellow-200 text-xs font-bold uppercase tracking-widest ml-1">
                    Rating
                  </label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-600 text-white cursor-pointer focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <option key={num} value={num}>
                        {num}+ Stars
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-2 bg-white/5 p-4 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center">
                  <label className="text-yellow-200 text-xs font-bold uppercase tracking-widest">
                    Year:{" "}
                    <span className="text-yellow-400 text-lg">
                      {formData.year}
                    </span>
                    +
                  </label>
                </div>
                <input
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  type="range"
                  min="1970"
                  max="2025"
                  step="1"
                  className="w-full h-2 bg-slate-700 rounded-lg accent-yellow-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-yellow-200 text-xs font-bold uppercase tracking-widest ml-1">
                  Mode
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setMode("swipe")}
                    className={`p-3 rounded-xl border flex justify-center gap-2 cursor-pointer transition-all ${
                      mode === "swipe"
                        ? "border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-[0_0_15px_rgba(255,193,58,0.3)]"
                        : "border-slate-700 bg-white/5 text-slate-50"
                    }`}
                  >
                    <Layers size={18} /> Swipe
                  </div>
                  <div
                    onClick={() => setMode("scroll")}
                    className={`p-3 rounded-xl border flex justify-center gap-2 cursor-pointer transition-all ${
                      mode === "scroll"
                        ? "border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-[0_0_15px_rgba(255,193,58,0.3)]"
                        : "border-slate-700 bg-white/5 text-slate-50"
                    }`}
                  >
                    <Grid size={18} /> Scroll
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-yellow-600 to-orange-400 text-white py-4 rounded-xl font-bold text-xl hover:scale-[1.02] transition-transform shadow-lg"
              >
                Start Matching
              </button>
            </form>
          </div>
        </div>
      </div>

      <Watchlist
        isOpen={isWatchlistOpen}
        onClose={() => {
          setIsWatchlistOpen(false);
          updateWatchlistCount();
        }}
      />
    </div>
  );
};

export default Home;
