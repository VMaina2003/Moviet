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
                <h3 class="text-lg font-semibold truncate hover:text-red-500">${title}</h3>
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

// Search functionality
const searchInput = document.getElementById('search-input');
let searchTimeout;

searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout); // Clear previous timeout
    const query = e.target.value.trim();

    searchTimeout = setTimeout(async () => {
        if (query.length > 2) { // Only search if query is at least 3 characters
            const searchResults = await fetchMovies(`/search/multi?query=${encodeURIComponent(query)}`);
            // We'll need a new section to display search results.
            // For now, let's just display them in the trending grid as a placeholder
            // In a real app, you'd likely hide other sections and show a dedicated search results section.

            // Let's create a dedicated search results section in HTML first:
            // <section id="search-results-section" class="mb-8 hidden">
            //     <h2 class="text-3xl font-bold mb-6">Search Results</h2>
            //     <div id="search-results-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            //         //     </div>
            // </section>

            const trendingSection = document.getElementById('trending-movies-grid'); // Temporarily use this
            const popularSection = document.getElementById('popular-movies-grid'); // Temporarily use this

            // Hide other sections if search results are present
            if (query.length > 0) {
                trendingSection.innerHTML = ''; // Clear trending
                popularSection.innerHTML = ''; // Clear popular
                displayMovies(searchResults, 'trending-movies-grid'); // Display search results here
                // If you added the dedicated search results section:
                // document.getElementById('search-results-section').classList.remove('hidden');
                // displayMovies(searchResults, 'search-results-grid');
            } else {
                // If search query is empty, reload initial content
                loadInitialContent();
                // If you added the dedicated search results section:
                // document.getElementById('search-results-section').classList.add('hidden');
            }
        } else if (query.length === 0) {
             // If search input is cleared, reload initial content
             loadInitialContent();
        }
    }, 500); // Debounce time: 500ms
});


document.addEventListener('DOMContentLoaded', loadInitialContent);
