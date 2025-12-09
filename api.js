const API_KEY = "cfc38c3e9ea356a10f7796e40c13efe0";
const BASE_URL = "https://api.themoviedb.org/3";

export const GENRES = [
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

export async function fetchMovies(prefs) {
  let endpoint = `${BASE_URL}/discover/movie`;
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    sort_by: "popularity.desc",
    include_adult: "false",
    page: "1",
    "vote_average.gte": prefs.rating || 5,
    "primary_release_date.gte": `${prefs.year || 2000}-01-01`,
  });

  if (prefs.genre) params.append("with_genres", prefs.genre);

  let results = [];

  // Search First if natural input exists
  if (prefs.natural && prefs.natural.trim().length > 0) {
    const searchUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      prefs.natural
    )}&include_adult=false`;
    try {
      const res = await fetch(searchUrl);
      const data = await res.json();
      results = data.results || [];
    } catch (e) {
      console.error("Search error", e);
    }
  }

  // Discover Fallback
  if (results.length < 5) {
    try {
      const res = await fetch(`${endpoint}?${params.toString()}`);
      const data = await res.json();
      const discoverResults = data.results || [];
      // Merge
      const existingIds = new Set(results.map((m) => m.id));
      const newMovies = discoverResults.filter((m) => !existingIds.has(m.id));
      results = [...results, ...newMovies];
    } catch (e) {
      console.error("Discover error", e);
    }
  }

  return results.filter((m) => m.poster_path);
}

export async function fetchMovieDetails(id) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`
    );
    return await res.json();
  } catch (e) {
    return null;
  }
}

export function getImageUrl(path, size = "w500") {
  return path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : "https://placehold.co/500x750?text=No+Image";
}

export async function enhanceWithGemini(input) {
  if (!GENAI_API_KEY || !input) return {};
  // Simple placeholder for structure.
  // In a real env with key, we would call generateContent here.
  return {};
}
