import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import BottomNavigation from '../components/BottomNavigation'

const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OGU2ZmI2NmI5MWFhOGYwZTFmMmI4Y2YzYmIxMzQyZSIsIm5iZiI6MTY1MDM2NDc2NS43NDMsInN1YiI6IjYyNWU5MTVkMmQzNzIxMTViMTAzZTk1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cqdQjwctMj2HWwkEDD6f7-TV-g0sEv2aeULnKa8cLFY'

export default function Search() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [genreMovies, setGenreMovies] = useState([])
  const [genreLoading, setGenreLoading] = useState(false)
  const [page, setPage] = useState(1)

  const categories = [
    { name: "🔥 Сейчас смотрят", color: "bg-orange-500", shadow: "rgba(249,115,22,0.35)", endpoint: "trending/movie/day" },
    { name: "⭐ Популярное", color: "bg-blue-500", shadow: "rgba(59,130,246,0.35)", endpoint: "movie/popular" },
    { name: "👑 Топ рейтинг", color: "bg-purple-500", shadow: "rgba(168,85,247,0.35)", endpoint: "movie/top_rated" },
    { name: "💥 Боевик", color: "bg-red-500", shadow: "rgba(239,68,68,0.35)", genreId: 28 },
    { name: "😂 Комедия", color: "bg-yellow-500", shadow: "rgba(234,179,8,0.35)", genreId: 35 },
    { name: "👻 Ужасы", color: "bg-gray-700", shadow: "rgba(55,65,81,0.35)", genreId: 27 },
    { name: "🚀 Фантастика", color: "bg-cyan-500", shadow: "rgba(6,182,212,0.35)", genreId: 878 },
    { name: "🕵 Триллер", color: "bg-emerald-500", shadow: "rgba(16,185,129,0.35)", genreId: 53 },
    { name: "❤️ Мелодрама", color: "bg-pink-500", shadow: "rgba(236,72,153,0.35)", genreId: 10749 },
    { name: "🔪 Криминал", color: "bg-slate-600", shadow: "rgba(71,85,105,0.35)", genreId: 80 },
    { name: "🐉 Фэнтези", color: "bg-indigo-500", shadow: "rgba(99,102,241,0.35)", genreId: 14 },
    { name: "⚔ Приключения", color: "bg-amber-500", shadow: "rgba(245,158,11,0.35)", genreId: 12 },
    { name: "🎭 Драма", color: "bg-rose-500", shadow: "rgba(244,63,94,0.35)", genreId: 18 },
    { name: "� Детектив", color: "bg-violet-500", shadow: "rgba(139,92,246,0.35)", genreId: 9648 },
    { name: "🧟 Выживание", color: "bg-lime-500", shadow: "rgba(132,204,22,0.35)", genreId: 27 },
    { name: "🎨 Мультфильмы", color: "bg-teal-500", shadow: "rgba(20,184,166,0.35)", genreId: 16 },
    { name: "📺 Сериалы", color: "bg-sky-500", shadow: "rgba(14,165,233,0.35)", endpoint: "trending/tv/day" },
    { name: "🏰 Исторические", color: "bg-stone-500", shadow: "rgba(120,113,108,0.35)", genreId: 36 },
    { name: "🤠 Вестерн", color: "bg-orange-600", shadow: "rgba(234,88,12,0.35)", genreId: 37 },
    { name: "🥷 Аниме", color: "bg-fuchsia-500", shadow: "rgba(217,70,239,0.35)", genreId: 16 }
  ]

  useEffect(() => {
    if (!query.trim()) {
      setMovies([])
      setPage(1)
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      setPage(1)
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ru-RU&page=1`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_API_KEY}`
            }
          }
        )
        const data = await response.json()
        setMovies(data.results || [])
      } catch (error) {
        console.log(error)
        setMovies([])
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [query])

  const fetchGenreMovies = async (category) => {
    setSelectedCategory(category.name)
    setGenreLoading(true)
    setQuery('') // Clear search when selecting category
    setMovies([]) // Clear search results
    setPage(1)

    try {
      let url
      if (category.endpoint) {
        url = `https://api.themoviedb.org/3/${category.endpoint}?language=ru-RU&page=1`
      } else if (category.genreId) {
        url = `https://api.themoviedb.org/3/discover/movie?with_genres=${category.genreId}&language=ru-RU&page=1`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`
        }
      })
      const data = await response.json()
      setGenreMovies(data.results || [])
    } catch (error) {
      console.log(error)
      setGenreMovies([])
    } finally {
      setGenreLoading(false)
    }
  }

  const handleCategoryClick = (category) => {
    if (selectedCategory === category.name) {
      setSelectedCategory(null)
      setGenreMovies([])
      setPage(1)
    } else {
      fetchGenreMovies(category)
    }
  }

  const loadMovies = async (currentPage) => {
    const displayLoading = selectedCategory ? genreLoading : loading
    if (displayLoading) return

    if (selectedCategory) {
      setGenreLoading(true)
    } else {
      setLoading(true)
    }

    try {
      let url
      if (selectedCategory) {
        const category = categories.find(c => c.name === selectedCategory)
        if (category) {
          if (category.endpoint) {
            url = `https://api.themoviedb.org/3/${category.endpoint}?language=ru-RU&page=${currentPage}`
          } else if (category.genreId) {
            url = `https://api.themoviedb.org/3/discover/movie?with_genres=${category.genreId}&language=ru-RU&page=${currentPage}`
          }
        }
      } else if (query.trim()) {
        url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ru-RU&page=${currentPage}`
      }

      if (!url) return

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`
        }
      })
      const data = await response.json()
      const newMovies = data.results || []

      if (selectedCategory) {
        setGenreMovies((prev) => [...prev, ...newMovies])
      } else {
        setMovies((prev) => [...prev, ...newMovies])
      }
    } catch (error) {
      console.log(error)
    } finally {
      if (selectedCategory) {
        setGenreLoading(false)
      } else {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    loadMovies(page)
  }, [page])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      const displayLoading = selectedCategory ? genreLoading : loading
      if (scrollTop + windowHeight + 300 >= documentHeight && !displayLoading) {
        setPage((prev) => prev + 1)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, genreLoading, selectedCategory])

  const displayMovies = selectedCategory ? genreMovies : movies
  const displayLoading = selectedCategory ? genreLoading : loading

  return (
    <div className="min-h-screen px-4 pt-4 pb-10">

      {/* HEADER */}
      <div className="mb-7">
        <div className="glitch-wrapper">
          <h1
            className="glitch-text text-white text-[42px] font-black tracking-[-2px]"
            data-text="ПОИСК"
          >
            ПОИСК
          </h1>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedCategory(null)
              setGenreMovies([])
            }}
            placeholder="Поиск фильмов..."
            className="w-full rounded-[24px] bg-white/10 px-6 py-4 text-lg text-white placeholder-slate-400 backdrop-blur-md ring-1 ring-white/20 outline-none transition-all duration-200 focus:bg-white/15 focus:ring-white/40"
          />
          <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
      </div>

      {/* CATEGORY SECTION */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCategoryClick(category)}
              className={`
                shrink-0 snap-start rounded-2xl px-5 py-3 text-sm font-bold text-white
                shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                transition-all duration-200 active:scale-95
                ${category.color}
                ${selectedCategory === category.name
                  ? 'ring-2 ring-white/60 shadow-[0_10px_30px_rgba(255,255,255,0.3)] scale-105'
                  : 'hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                }
              `}
              style={{
                boxShadow: selectedCategory === category.name
                  ? `0 10px 30px ${category.shadow}, 0 0 20px ${category.shadow}`
                  : `0 10px 30px ${category.shadow}`
              }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* MOVIES GRID */}
      {displayMovies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          {displayMovies.map((movie, index) => (
            <motion.div
              key={`${movie.id}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="overflow-hidden rounded-[28px] bg-white/5 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-200 active:scale-[0.97]"
            >
              {/* POSTER */}
              <div className="relative h-[230px] overflow-hidden">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/10">
                    <span className="text-slate-400">Нет постера</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* INFO */}
              <div className="p-3">
                <h2 className="line-clamp-1 text-sm font-bold text-white">
                  {movie.title || movie.name}
                </h2>
                <p className="mt-1 text-xs text-yellow-300">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* EMPTY STATE */}
      {!displayLoading && (query || selectedCategory) && displayMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-400">
            {selectedCategory ? 'Нет фильмов в этой категории' : 'Ничего не найдено'}
          </p>
        </div>
      )}

      {/* LOADING */}
      {displayLoading && (
        <div className="mt-8 flex justify-center">
          <div className="rounded-2xl bg-white/10 px-5 py-3 text-sm text-white backdrop-blur-md">
            {selectedCategory ? 'Загрузка...' : 'Поиск...'}
          </div>
        </div>
      )}

      <BottomNavigation />

    </div>
  )
}