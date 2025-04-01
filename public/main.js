// public/main.js

// Event listener for the search button
document.getElementById("searchButton").addEventListener("click", async () => {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    displayResults(data);
  });
  
  // Display search results on the page (client-side rendering)
  function displayResults(data) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    document.getElementById("movieDetails").innerHTML = "";
    if (data.Search && data.Search.length > 0) {
      data.Search.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";
        const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150";
        card.innerHTML = `
          <img src="${poster}" alt="${movie.Title}">
          <h3>${movie.Title}</h3>
        `;
        card.addEventListener("click", () => fetchMovieDetails(movie.imdbID));
        resultsDiv.appendChild(card);
      });
    } else {
      resultsDiv.innerHTML = "<p>No movies found.</p>";
    }
  }
  
  // Fetch movie details when a movie is clicked
  async function fetchMovieDetails(id) {
    const response = await fetch(`/api/movie/${id}`);
    const movie = await response.json();
    displayMovieDetails(movie);
  }
  
  // Display movie details on the page
  function displayMovieDetails(movie) {
    const detailsDiv = document.getElementById("movieDetails");
    detailsDiv.innerHTML = `
      <h2>${movie.Title}</h2>
      <p><strong>Year:</strong> ${movie.Year}</p>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
    `;
  }
  