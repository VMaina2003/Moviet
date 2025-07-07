const API_KEY = "1c6a30042546b32b016f0735ec16a17e"; // Replace with your actual API key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Function to fetch data from TMDb
async function fetchMovies(endpoint) {
  try {
    const response = await fetch(
      `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US&page=1`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to create a movie card HTML
function createMovieCard(movie) {
    const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
    const title = movie.title || movie.name; // 'title' for movies, 'name' for TV shows
    const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    return `
        <div class="bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer" data-movie-id="${movie.id}" data-media-type="${movie.media_type || 'movie'}">
            <img src="${posterPath}" alt="${title}" class="w-full h-72 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold truncate">${title}</h3>
                <p class="text-sm text-gray-400 mt-2">Rating: ${voteAverage} / 10</p>
            </div>
        </div>
    `;
}
// Function to display movies in a given container
function displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = ''; // Clear previous content
        movies.forEach(movie => {
            container.innerHTML += createMovieCard(movie);
        });
    }
}

// Load initial trending movies
async function loadInitialContent() {
    const trendingMovies = await fetchMovies('/trending/movie/week');
    displayMovies(trendingMovies, 'trending-movies-grid');

    const popularMovies = await fetchMovies('/movie/popular');
    displayMovies(popularMovies, 'popular-movies-grid');

    // You can add logic here to select a random trending movie for the hero section
    if (trendingMovies.length > 0) {
        const heroMovie = trendingMovies[0]; // Or a random one
        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
            heroSection.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`;
            heroSection.querySelector('h2').textContent = heroMovie.title || heroMovie.name;
            heroSection.querySelector('p').textContent = heroMovie.overview.substring(0, 150) + '...'; // Truncate description
            // You can add an event listener to the "Watch Trailer" button later
        }
    }
}


document.addEventListener('DOMContentLoaded', loadInitialContent);
