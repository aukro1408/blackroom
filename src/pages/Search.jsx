import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNavigation from '../components/BottomNavigation'

const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OGU2ZmI2NmI5MWFhOGYwZTFmMmI4Y2YzYmIxMzQyZSIsIm5iZiI6MTY1MDM2NDc2NS43NDMsInN1YiI6IjYyNWU5MTVkMmQzNzIxMTViMTAzZTk1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cqdQjwctMj2HWwkEDD6f7-TV-g0sEv2aeULnKa8cLFY'

export default function Search() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setMovies([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ru-RU`,
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
            onChange={(e) => setQuery(e.target.value)}
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

      {/* MOVIES GRID */}
      {movies.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {movies.map((movie, index) => (
            <div
              key={`${movie.id}-${index}`}
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
                  {movie.title}
                </h2>
                <p className="mt-1 text-xs text-yellow-300">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && query && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-400">
            Ничего не найдено
          </p>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="mt-8 flex justify-center">
          <div className="rounded-2xl bg-white/10 px-5 py-3 text-sm text-white backdrop-blur-md">
            Поиск...
          </div>
        </div>
      )}

      <BottomNavigation />

    </div>
  )
}