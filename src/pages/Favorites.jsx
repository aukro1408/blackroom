import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Film } from 'lucide-react'
import BottomNavigation from '../components/BottomNavigation'
import { getFavorites, removeFavorite, FAVORITES_KEY } from '../utils/favorites'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

export default function Favorites() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Read favorites from localStorage
  const readFavorites = useCallback(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      const data = stored ? JSON.parse(stored) : []
      setFavorites(data)
      setIsLoaded(true)
    } catch {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    readFavorites()

    // Listen for storage changes (updates from other tabs/pages)
    const handleStorageChange = () => {
      readFavorites()
    }

    // Listen for same-tab updates via custom event
    const handleFavoritesUpdate = (e) => {
      setFavorites(e.detail)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate)
    }
  }, [readFavorites])

  const handleRemoveFavorite = (e, movieId) => {
    e.stopPropagation()
    setFavorites(getFavorites())
  }

  const handleCardClick = (movie) => {
    navigate(`/movie/${movie.id}`)
  }

  const handleRemove = (e, movieId) => {
    e.stopPropagation()
    const updated = removeFavorite(movieId)
    setFavorites(updated)
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: updated }))
  }

  // Show loading or empty state while loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen px-4 pt-8 pb-36">
        <h1 className="text-[42px] font-black tracking-[-2px] text-white mb-4">
          ИЗБРАННОЕ
        </h1>
        <div className="flex items-center justify-center mt-20">
          <div className="animate-pulse text-slate-400">Загрузка...</div>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen px-4 pt-8 pb-36">
        <h1 className="text-[42px] font-black tracking-[-2px] text-white mb-4">
          ИЗБРАННОЕ
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center mt-20"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
            <div className="relative p-8 rounded-full bg-white/5 backdrop-blur-xl ring-1 ring-white/10">
              <Heart size={64} className="text-slate-500" strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Избранное пусто
          </h2>

          <p className="text-slate-400 text-center max-w-xs mt-2">
            Добавляйте фильмы в избранное, нажимая на сердечко
          </p>

          <button
            onClick={() => navigate('/')}
            className="mt-8 px-6 py-3 rounded-2xl bg-white/10 text-white font-semibold backdrop-blur-md ring-1 ring-white/20 transition-all duration-200 active:scale-95 hover:bg-white/20"
          >
            Перейти к фильмам
          </button>
        </motion.div>

        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 pt-4 pb-36">
      {/* HEADER */}

      <div className="mb-6 relative">
        <h1 className="text-[42px] font-black tracking-[-2px] text-white">
          ИЗБРАННОЕ
        </h1>
        <p className="text-slate-400 mt-1">
          {favorites.length} {favorites.length === 1 ? 'фильм' : favorites.length >= 2 && favorites.length <= 4 ? 'фильма' : 'фильмов'}
        </p>
      </div>

      {/* FAVORITES GRID */}

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 gap-4"
      >
        {favorites.map((movie, index) => (
          <motion.div
            key={movie.id}
            variants={itemVariants}
            onClick={() => handleCardClick(movie)}
            className="relative cursor-pointer rounded-[28px] bg-white/5 p-3 backdrop-blur-md ring-1 ring-white/10 transition-all duration-200 active:scale-[0.96]"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* POSTER */}
            <div className="relative h-[200px] overflow-hidden rounded-[20px] bg-white/5">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Film size={48} className="text-slate-600" />
                </div>
              )}

              {/* REMOVE BUTTON */}
              <button
                onClick={(e) => handleRemove(e, movie.id)}
                className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-2 backdrop-blur-md transition-all duration-200 active:scale-90"
              >
                <Heart
                  size={18}
                  className="fill-red-500 text-red-500"
                  strokeWidth={2}
                />
              </button>

              {/* RATING */}
              {movie.vote_average > 0 && (
                <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-md">
                  <span className="text-xs font-bold text-yellow-300">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="mt-3">
              <h3 className="line-clamp-2 text-sm font-bold text-white leading-tight">
                {movie.title}
              </h3>
              {movie.release_date && (
                <p className="mt-1 text-xs text-slate-400">
                  {movie.release_date.slice(0, 4)}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <BottomNavigation />
    </div>
  )
}