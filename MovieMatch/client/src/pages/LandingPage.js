import React from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="bg-slate-900 text-white font-sans overflow-hidden">
      <div className="relative h-screen w-full flex flex-col items-center justify-center">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1483016740221-2f428bfd0aab?q=80&w=2033&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-2xl animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl font-bold font-[Permanent Marker] text-yellow-400 mb-4 drop-shadow-lg -rotate-2">
            MovieMatch
          </h1>

          <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 tracking-wide font-[Permanent Marker]">
            The Film You've Been Looking For...
          </h2>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 group relative px-8 py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 text-xl font-bold rounded-full overflow-hidden transition-all hover:text-slate-900 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]"
          >
            <div className="absolute inset-0 w-full h-full bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              Start Discovering <Play size={20} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
