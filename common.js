import { getImageUrl } from "./api.js";

// --- WATCHLIST MANAGEMENT ---
export function getWatchlist() {
  return JSON.parse(localStorage.getItem("mm_watchlist") || "[]");
}

export function addToWatchlist(movie) {
  const list = getWatchlist();
  if (!list.find((m) => m.id === movie.id)) {
    list.push({ ...movie, watched: false });
    localStorage.setItem("mm_watchlist", JSON.stringify(list));
    updateWatchlistUI();
    return true;
  }
  return false;
}

export function removeFromWatchlist(id) {
  let list = getWatchlist();
  list = list.filter((m) => m.id !== id);
  localStorage.setItem("mm_watchlist", JSON.stringify(list));
  updateWatchlistUI();
}

export function toggleWatched(id) {
  let list = getWatchlist();
  list = list.map((m) => (m.id === id ? { ...m, watched: !m.watched } : m));
  localStorage.setItem("mm_watchlist", JSON.stringify(list));
  updateWatchlistUI();
}

// --- UI HELPERS ---
export function setupWatchlistUI() {
  const overlay = document.getElementById("watchlist-overlay");
  const sidebar = document.getElementById("watchlist-sidebar");
  const toggleBtn = document.getElementById("watchlist-toggle");
  const closeBtn = document.getElementById("watchlist-close");

  function toggle() {
    sidebar.classList.toggle("translate-x-full");
    overlay.classList.toggle("hidden");
    overlay.classList.toggle("opacity-0");
    updateWatchlistUI();
  }

  if (toggleBtn) toggleBtn.addEventListener("click", toggle);
  if (closeBtn) closeBtn.addEventListener("click", toggle);
  if (overlay) overlay.addEventListener("click", toggle);

  updateWatchlistUI();
}

function updateWatchlistUI() {
  const list = getWatchlist();
  const container = document.getElementById("watchlist-items");
  const countBadge = document.getElementById("watchlist-count");
  const stats = document.getElementById("watchlist-stats");

  if (countBadge) countBadge.textContent = list.length;
  if (stats)
    stats.textContent = `${list.filter((m) => m.watched).length} / ${
      list.length
    } Watched`;

  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<div class="text-center text-white-400 mt-10"><p>No movies yet.</p></div>`;
    return;
  }

  container.innerHTML = list
    .map(
      (m) => `
        <div class="flex gap-3 items-start p-2 rounded-lg hover:bg-slate-900 transition-colors group">
            <img src="${getImageUrl(
              m.poster_path,
              "w200"
            )}" class="w-16 h-24 object-cover rounded-md shadow-sm">
            <div class="flex-1">
                <h4 class="font-bold text-sm leading-tight mb-1 text-slate-50 ${
                  m.watched ? "line-through text-slate-400" : ""
                }">${m.title}</h4>
                <p class="text-xs text-slate-50 mb-2">${
                  m.release_date?.split("-")[0] || ""
                }</p>
                <div class="flex gap-2">
                    <button class="btn-toggle text-xs font-semibold text-yellow-600" data-id="${
                      m.id
                    }">
                        ${m.watched ? "Unwatched" : "Watched"}
                    </button>
                    <button class="btn-remove text-red-400 ml-auto" data-id="${
                      m.id
                    }">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  // Re-attach listeners
  container.querySelectorAll(".btn-toggle").forEach((b) => {
    b.addEventListener("click", () => toggleWatched(parseInt(b.dataset.id)));
  });
  container.querySelectorAll(".btn-remove").forEach((b) => {
    b.addEventListener("click", () =>
      removeFromWatchlist(parseInt(b.dataset.id))
    );
  });

  if (window.lucide) window.lucide.createIcons();
}

export function createCardHTML(movie, showControls = false) {
  const poster = getImageUrl(movie.poster_path);
  return `
        <div class="card card-inner w-full h-full relative rounded-3xl shadow-2xl transition-transform duration-500" data-id="${
          movie.id
        }">
            <!-- FRONT -->
            <div class="card-front bg-slate-800 border border-slate-700">
                <img src="${poster}" class="w-full h-full object-cover pointer-events-none">
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 w-full p-6 text-white pb-10 text-left">
                    <h3 class="font-bold text-2xl truncate mb-1 text-shadow pr-10">${
                      movie.title
                    }</h3>
                    <div class="flex items-center gap-3 text-slate-300 text-sm">
                        <span>${
                          movie.release_date?.split("-")[0] || "N/A"
                        }</span>
                        <span class="text-yellow-500 flex items-center gap-1">★ ${movie.vote_average.toFixed(
                          1
                        )}</span>
                    </div>
                </div>
                <div class="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 z-20 shadow-lg pointer-events-none">
                    <i data-lucide="info" class="w-5 h-5"></i>
                </div>
            </div>
            <!-- BACK -->
            <div class="card-back p-6 flex flex-col text-left overflow-y-auto no-scrollbar border-4 border-slate-800 bg-white text-slate-900">
                <div class="flex-1 space-y-4">
                    <h2 class="text-2xl font-bold leading-tight pr-8">${
                      movie.title
                    }</h2>
                    <div class="details-genres flex flex-wrap gap-2 text-xs text-slate-500">Loading...</div>
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-2">
                        <div class="flex justify-between">
                            <span class="details-runtime">-- min</span>
                            <span class="text-yellow-600 font-bold">★ ${movie.vote_average.toFixed(
                              1
                            )}</span>
                        </div>
                        <div class="details-director pt-2 border-t border-slate-200">Dir: --</div>
                    </div>
                    <p class="text-slate-700 text-sm leading-relaxed">${
                      movie.overview || "No overview."
                    }</p>
                    <div class="details-cast"></div>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                     <button class="btn-back flex-1 py-2 text-slate-500 font-bold text-sm bg-slate-100 rounded-lg">Back</button>
                     <button class="btn-add-wl flex-1 py-2 bg-red-500 text-white font-bold text-sm rounded-lg hover:bg-red-600 flex items-center justify-center gap-2">
                        <i data-lucide="heart" class="w-4 h-4 fill-current"></i> Add
                     </button>
                </div>
            </div>
        </div>
    `;
}
