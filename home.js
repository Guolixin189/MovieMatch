import { GENRES } from "./api.js";
import { setupWatchlistUI } from "./common.js";

document.addEventListener("DOMContentLoaded", () => {
  setupGenres();
  setupWatchlistUI();
  setupForm();
  lucide.createIcons();
});

function setupGenres() {
  const sel = document.getElementById("input-genre");
  GENRES.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = g.name;
    sel.appendChild(opt);
  });
}

function setupForm() {
  const yearRange = document.getElementById("input-year");
  const yearDisplay = document.getElementById("year-display");
  const modeOpts = document.querySelectorAll(".mode-opt");
  let selectedMode = "swipe";

  yearRange.addEventListener(
    "input",
    (e) => (yearDisplay.textContent = e.target.value)
  );

  modeOpts.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedMode = btn.dataset.mode;
      modeOpts.forEach((b) => {
        b.classList.remove(
          "active",
          "border-yellow-500",
          "bg-yellow-500/20",
          "text-yellow-400"
        );
        b.classList.add("border-slate-700", "bg-gray-80/80", "text-slate-50");
      });
      btn.classList.remove(
        "border-slate-700",
        "bg-slate-800/80",
        "text-slate-500"
      );
      btn.classList.add(
        "active",
        "border-yellow-500",
        "bg-yellow-500/20",
        "text-yellow-400"
      );
    });
  });

  document
    .getElementById("preferences-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const prefs = {
        natural: document.getElementById("input-natural").value,
        genre: document.getElementById("input-genre").value,
        rating: document.getElementById("input-rating").value,
        year: document.getElementById("input-year").value,
      };

      localStorage.setItem("mm_prefs", JSON.stringify(prefs));

      if (selectedMode === "swipe") {
        window.location.href = "SwipeMode.html";
      } else {
        window.location.href = "scrollMode.html";
      }
    });
}
