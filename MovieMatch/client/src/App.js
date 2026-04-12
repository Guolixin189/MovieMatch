import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";

import Swipe from "./pages/Swipe";
import Scroll from "./pages/Scroll";
import Auth from "./components/Auth";
import Navbar from "./components/Navbar";
import Watchlists from "./pages/Watchlists";
import PublicChannel from "./pages/PublicChannel";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("mm_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("mm_token");
    localStorage.removeItem("mm_user");
    setUser(null);
  };

  return (
    <div className="App bg-slate-950 min-h-screen text-slate-100 flex flex-col">
      {!user ? (
        <Auth onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />
      ) : (
        <Router>
          <Navbar user={user} onLogout={handleLogout} />
          <main className="pt-20 flex-1 relative overflow-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/swipe" element={<Swipe />} />
              <Route path="/scroll" element={<Scroll />} />
              <Route path="*" element={<Navigate to="/swipe" />} />
              <Route path="/watchlists" element={<Watchlists />} />
              <Route path="/community" element={<PublicChannel />} />
            </Routes>
          </main>
        </Router>
      )}
    </div>
  );
}

export default App;
