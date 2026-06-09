import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import BottomNavigation from '../components/BottomNavigation'

const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OGU2ZmI2NmI5MWFhOGYwZTFmMmI4Y2YzYmIxMzQyZSIsIm5iZiI6MTY1MDM2NDc2NS43NDMsInN1YiI6IjYyNWU5MTVkMmQzNzIxMTViMTAzZTk1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cqdQjwctMj2HWwkEDD6f7-TV-g0sEv2aeULnKa8cLFY'

export default function MoviePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=ru-RU`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`
        }
      }
    )
      .then(res => res.json())
      .then(data => {
        setMovie(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch movie:', err)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen px-4 pt-4 pb-10">
        <div className="flex min-h-[400px] items-center justify-center text-white/50">
          Загрузка...
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen px-4 pt-4 pb-10">
        <div className="flex min-h-[400px] items-center justify-center text-white/50">
          Фильм не найден
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 pt-4 pb-10">
      {/* HEADER */}

      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/20 transition-all duration-200 active:scale-95 hover:bg-white/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <h1 className="text-[28px] font-black text-white">
          {movie.title}
        </h1>
      </div>

      {/* BACKDROP */}

      {movie.backdrop_path && (
        <div className="relative mb-6 h-[200px] overflow-hidden rounded-3xl">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      )}

      {/* MOVIE INFO */}

      <div className="flex gap-4">
        {/* POSTER */}

        {movie.poster_path && (
          <div className="shrink-0 w-[120px] overflow-hidden rounded-2xl">
            <img
              src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
              alt={movie.title}
              className="h-[180px] w-full object-cover"
            />
          </div>
        )}

        {/* DETAILS */}

        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-yellow-400/20 px-2 py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-yellow-400"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-sm font-bold text-yellow-400">
                {movie.vote_average?.toFixed(1)}
              </span>
            </div>

            {movie.release_date && (
              <span className="text-sm text-white/60">
                {new Date(movie.release_date).getFullYear()}
              </span>
            )}
          </div>

          {/* GENRES */}

          {movie.genres && movie.genres.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {movie.genres.map(genre => (
                <span
                  key={genre.id}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* OVERVIEW */}

          {movie.overview && (
            <p className="text-sm text-white/80 leading-relaxed">
              {movie.overview}
            </p>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
