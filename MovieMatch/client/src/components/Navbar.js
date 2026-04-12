import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex justify-between items-center shadow-md">
      <div
        className="font-[Permanent_Marker] text-3xl text-yellow-500 -rotate-2 cursor-pointer hover:scale-105 transition-transform"
        onClick={() => navigate("/")}
      >
        MovieMatch
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/community")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-sm transition-all border ${
              location.pathname === "/community"
                ? "bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-md"
                : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <span>🌐</span> Community
          </button>

          <div className="flex bg-slate-900 rounded-full p-1 border border-slate-700 shadow-inner">
            <button
              onClick={() => navigate("/swipe")}
              className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${
                location.pathname === "/swipe"
                  ? "bg-yellow-500 text-slate-900 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Swipe
            </button>
            <button
              onClick={() => navigate("/scroll")}
              className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${
                location.pathname === "/scroll"
                  ? "bg-yellow-500 text-slate-900 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Scroll
            </button>
          </div>

          <button
            onClick={() => navigate("/watchlists")}
            className={`w-10 h-10 rounded-full flex justify-center items-center shadow-lg transition-transform hover:scale-105 ${
              location.pathname === "/watchlists"
                ? "bg-red-600 text-white ring-2 ring-red-400 ring-offset-2 ring-offset-slate-950"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
            title="My Library"
          >
            📋
          </button>
        </div>

        <div className="flex flex-col items-end border-l border-slate-700 pl-6">
          <span className="text-sm font-bold text-slate-200">
            Hi, {user.username}!
          </span>
          <button
            onClick={onLogout}
            className="text-xs text-slate-500 hover:text-red-500 transition-colors mt-0.5 underline underline-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
