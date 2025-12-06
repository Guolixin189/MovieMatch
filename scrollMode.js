import { fetchMovies, fetchMovieDetails } from "./api.js";
import { addToWatchlist, setupWatchlistUI, createCardHTML } from "./common.js";

let movies = [];

document.addEventListener("DOMContentLoaded", async () => {
  setupWatchlistUI();
  lucide.createIcons();

  const prefs = JSON.parse(localStorage.getItem("mm_prefs") || "{}");
  movies = await fetchMovies(prefs);

  document.getElementById("loading").classList.add("hidden");

  if (movies.length === 0) {
    document.getElementById("empty-state").classList.remove("hidden");
  } else {
    renderGrid();
  }
});

function renderGrid() {
  const container = document.getElementById("grid-container");
  container.innerHTML = "";

  movies.forEach((movie, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper perspective-1000 opacity-0";
    wrapper.innerHTML = createCardHTML(movie);

    // Stagger animation
    setTimeout(() => wrapper.classList.remove("opacity-0"), index * 50);
    wrapper.style.transition = "opacity 0.5s ease";

    container.appendChild(wrapper);

    const cardInner = wrapper.querySelector(".card-inner");

    // Flip Logic
    wrapper.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      toggleFlip(cardInner, movie.id);
    });

    // Watchlist button
    wrapper.querySelector(".btn-add-wl").addEventListener("click", (e) => {
      e.stopPropagation();
      if (addToWatchlist(movie)) {
        const btn = e.currentTarget;
        btn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> Added`;
        btn.classList.add("bg-green-500");
        lucide.createIcons();
      }
    });

    // Back button
    wrapper.querySelector(".btn-back").addEventListener("click", (e) => {
      e.stopPropagation();
      cardInner.classList.remove("is-flipped");
    });
  });
  lucide.createIcons();
}

async function toggleFlip(cardEl, id) {
  cardEl.classList.toggle("is-flipped");
  if (cardEl.classList.contains("is-flipped") && !cardEl.dataset.loaded) {
    const details = await fetchMovieDetails(id);
    if (details) injectDetails(cardEl, details);
    cardEl.dataset.loaded = "true";
  }
}

function injectDetails(cardEl, data) {
  const genres = data.genres
    ? data.genres
        .map(
          (g) =>
            `<span class="bg-slate-100 px-2 py-1 rounded-full border">${g.name}</span>`
        )
        .join("")
    : "";
  cardEl.querySelector(".details-genres").innerHTML = genres;

  if (data.runtime)
    cardEl.querySelector(".details-runtime").textContent = `${Math.floor(
      data.runtime / 60
    )}h ${data.runtime % 60}m`;

  const dir = data.credits?.crew.find((c) => c.job === "Director");
  if (dir)
    cardEl.querySelector(".details-director").textContent = `Dir: ${dir.name}`;

  const cast = data.credits?.cast.slice(0, 4);
  if (cast) {
    cardEl.querySelector(".details-cast").innerHTML = `
            <div class="font-bold text-xs text-slate-400 uppercase mb-2">Cast</div>
            <div class="flex gap-2 overflow-x-auto no-scrollbar">
                ${cast
                  .map(
                    (c) => `
                    <div class="w-14 text-center flex-shrink-0">
                        <img src="${
                          c.profile_path
                            ? "https://image.tmdb.org/t/p/w200" + c.profile_path
                            : "https://via.placeholder.com/100"
                        }" class="w-14 h-14 rounded-full object-cover mb-1">
                        <div class="text-[10px] leading-tight truncate">${
                          c.name
                        }</div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;
  }
}
