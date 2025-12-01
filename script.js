const API_KEY = "cfc38c3e9ea356a10f7796e40c13efe0";
const endpoint = `https://api.themoviedb.org/3/search/movie?query=barbie&api_key=${API_KEY}`;

fetch(endpoint)
  .then((res) => res.json())
  .then((data) => {
    const movies = data.results;
    let html = "";

    movies.forEach((movie) => {
      html += `
        <h3>${movie.title}</h3>
        <p>${movie.overview}</p>
    `;
    });

    document.getElementById("output").innerHTML = html;
  })
  .catch((err) => {
    console.error("ERROR FETCHING:", err);
  });
