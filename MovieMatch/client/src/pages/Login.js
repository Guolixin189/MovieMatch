import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("mm_token", "dummy_token");
    navigate("/home");
  };

  return (
    <div className="bg-slate-900 text-white font-sans min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&auto=format&fit=crop&q=60')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-700/50">
        <Link to="/" className="block text-center mb-8">
          <h1 className="font-[Permanent_Marker] text-4xl text-yellow-400 drop-shadow-md">
            MovieMatch
          </h1>
        </Link>

        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-yellow-200 text-xs font-bold uppercase tracking-widest ml-1">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full p-3 mt-1 rounded-xl bg-slate-800 border border-slate-600 focus:border-yellow-400 focus:outline-none text-white"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="text-yellow-200 text-xs font-bold uppercase tracking-widest ml-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full p-3 mt-1 rounded-xl bg-slate-800 border border-slate-600 focus:border-yellow-400 focus:outline-none text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-yellow-200 text-xs font-bold uppercase tracking-widest ml-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full p-3 mt-1 rounded-xl bg-slate-800 border border-slate-600 focus:border-yellow-400 focus:outline-none text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-yellow-600 to-orange-400 text-white py-3 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-yellow-400 hover:underline font-bold"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
