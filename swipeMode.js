import { fetchMovies, fetchMovieDetails } from "./api.js";
import { addToWatchlist, setupWatchlistUI, createCardHTML } from "./common.js";

let movies = [];
let currentIndex = 0;
let activeCard = null;

document.addEventListener("DOMContentLoaded", async () => {
  setupWatchlistUI();
  lucide.createIcons();

  const prefs = JSON.parse(localStorage.getItem("mm_prefs") || "{}");
  movies = await fetchMovies(prefs);

  document.getElementById("loading").classList.add("hidden");

  if (movies.length === 0) {
    document.getElementById("empty-state").classList.remove("hidden");
    document.getElementById("controls").classList.add("hidden");
  } else {
    renderStack();
  }

  // Button Listeners
  document
    .getElementById("btn-skip")
    .addEventListener("click", () => swipe("left"));
  document
    .getElementById("btn-like")
    .addEventListener("click", () => swipe("right"));
});

function renderStack() {
  const container = document.getElementById("swipe-deck");
  // Clear old cards except loading/empty
  Array.from(container.children).forEach((c) => {
    if (!c.id || (c.id !== "loading" && c.id !== "empty-state")) c.remove();
  });

  if (currentIndex >= movies.length) {
    document.getElementById("empty-state").classList.remove("hidden");
    return;
  }

  // Render next 2
  const visible = movies.slice(currentIndex, currentIndex + 2).reverse();

  visible.forEach((movie, idx) => {
    const isTop = idx === visible.length - 1;
    const el = document.createElement("div");
    el.className = `card-stack-item perspective-1000 ${
      isTop
        ? "z-20 cursor-grab active:cursor-grabbing"
        : "z-10 scale-95 opacity-50 translate-y-5"
    }`;
    el.innerHTML = createCardHTML(movie);

    container.appendChild(el);

    const cardInner = el.querySelector(".card-inner");

    // Flip Logic (Click anywhere)
    el.addEventListener("click", (e) => {
      if (e.target.closest("button")) return; // Don't flip if button clicked
      toggleFlip(cardInner, movie.id);
    });

    // Watchlist button in back
    el.querySelector(".btn-add-wl").addEventListener("click", (e) => {
      e.stopPropagation();
      addToWatchlist(movie);
      swipe("right");
    });

    // Back button
    el.querySelector(".btn-back").addEventListener("click", (e) => {
      e.stopPropagation();
      cardInner.classList.remove("is-flipped");
    });

    if (isTop) {
      activeCard = el;
      initDrag(el);
    }
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

function initDrag(el) {
  let startX = 0,
    currentX = 0;
  let isDragging = false;

  const start = (e) => {
    isDragging = true;
    startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    el.style.transition = "none";
  };

  const move = (e) => {
    if (!isDragging) return;
    const cx = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    currentX = cx - startX;
    el.style.transform = `translateX(${currentX}px) rotate(${
      currentX * 0.05
    }deg)`;
  };

  const end = () => {
    if (!isDragging) return;
    isDragging = false;
    el.style.transition = "transform 0.3s ease";

    if (currentX > 100) swipe("right");
    else if (currentX < -100) swipe("left");
    else el.style.transform = "translate(0px) rotate(0deg)";
  };

  el.addEventListener("mousedown", start);
  el.addEventListener("touchstart", start);
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move);
  window.addEventListener("mouseup", end);
  window.addEventListener("touchend", end);
}

function swipe(dir) {
  if (!activeCard) return;
  const x = dir === "right" ? window.innerWidth : -window.innerWidth;
  activeCard.style.transition = "transform 0.4s ease-in";
  activeCard.style.transform = `translateX(${x}px) rotate(${
    dir === "right" ? 30 : -30
  }deg)`;

  if (dir === "right") addToWatchlist(movies[currentIndex]);

  setTimeout(() => {
    currentIndex++;
    renderStack();
  }, 300);
}
