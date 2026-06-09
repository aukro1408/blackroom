const FAVORITES_KEY = 'blackroom_favorites'

// Dispatch custom event when favorites change (for same-tab updates)
function dispatchFavoritesChange(favorites) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: favorites }))
  }
}

// Get all favorites from localStorage
export function getFavorites() {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY)
    return favorites ? JSON.parse(favorites) : []
  } catch {
    return []
  }
}

// Check if a movie is already a favorite
export function isFavorite(movieId) {
  const favorites = getFavorites()
  return favorites.some(movie => movie.id === movieId)
}

// Add a movie to favorites
export function addFavorite(movie) {
  const favorites = getFavorites()
  const movieData = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    media_type: movie.media_type || 'movie'
  }
  // Don't add duplicates
  if (!favorites.some(m => m.id === movieData.id)) {
    favorites.push(movieData)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    dispatchFavoritesChange(favorites)
  }
  return favorites
}

// Remove a movie from favorites
export function removeFavorite(movieId) {
  const favorites = getFavorites()
  const filtered = favorites.filter(movie => movie.id !== movieId)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
  dispatchFavoritesChange(filtered)
  return filtered
}

// Toggle favorite status - returns true if now favorite, false if removed
export function toggleFavorite(movie) {
  if (isFavorite(movie.id)) {
    removeFavorite(movie.id)
    return false
  } else {
    addFavorite(movie)
    return true
  }
}

export { FAVORITES_KEY }