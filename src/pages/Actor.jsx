import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OGU2ZmI2NmI5MWFhOGYwZTFmMmI4Y2YzYmIxMzQyZSIsIm5iZiI6MTY1MDM2NDc2NS43NDMsInN1YiI6IjYyNWU5MTVkMmQzNzIxMTViMTAzZTk1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cqdQjwctMj2HWwkEDD6f7-TV-g0sEv2aeULnKa8cLFY'

export default function Actor() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [actor, setActor] = useState(null)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    // Fetch actor details
    fetch(
      `https://api.themoviedb.org/3/person/${id}?language=ru-RU`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`
        }
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setActor(data)

        // Fetch actor movie credits
        fetch(
          `https://api.themoviedb.org/3/person/${id}/movie_credits?language=ru-RU`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_API_KEY}`
            }
          }
        )
          .then((res) => res.json())
          .then((creditsData) => {
            setMovies(creditsData.cast || [])
            setLoading(false)
          })
          .catch(() => setLoading(false))
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading || !actor) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Загрузка...
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 pt-4 pb-36">

      {/* HEADER */}
      <div className="mb-7">
        <div className="glitch-wrapper">
          <h1
            className="glitch-text text-white text-[42px] font-black tracking-[-2px]"
            data-text="АКТЁР"
          >
            АКТЁР
          </h1>
        </div>
      </div>

      {/* ACTOR INFO */}
      <div className="mb-8 rounded-[32px] bg-white/10 p-5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="flex gap-5">
          {/* PHOTO */}
          <div className="shrink-0">
            {actor.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                className="w-[140px] rounded-[24px] object-cover"
              />
            ) : (
              <div className="flex h-[180px] w-[140px] items-center justify-center rounded-[24px] bg-white/10 text-6xl">
                🎭
              </div>
            )}
          </div>

          {/* NAME & BIO */}
          <div className="flex-1">
            <h2 className="text-2xl font-black text-white">
              {actor.name}
            </h2>
            {actor.known_for_department && (
              <p className="mt-1 text-sm text-slate-300">
                {actor.known_for_department}
              </p>
            )}
            {actor.birthday && (
              <p className="mt-2 text-sm text-slate-300">
                Родился: {actor.birthday}
                {actor.deathday && ` — ${actor.deathday}`}
              </p>
            )}
            {actor.place_of_birth && (
              <p className="mt-1 text-sm text-slate-300">
                Место: {actor.place_of_birth}
              </p>
            )}
          </div>
        </div>

        {/* BIOGRAPHY */}
        {actor.biography && (
          <div className="mt-5">
            <h3 className="mb-2 text-lg font-bold text-white">
              Биография
            </h3>
            <p className="text-sm leading-6 text-slate-200">
              {actor.biography}
            </p>
          </div>
        )}
      </div>

      {/* MOVIES */}
      {movies.length > 0 && (
        <div>
          <h3 className="mb-4 text-xl font-bold text-white">
            Фильмы с участием актёра
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {movies.map((movie, index) => (
              <div
                key={`${movie.id}-${index}`}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="overflow-hidden rounded-[28px] bg-white/5 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-200 active:scale-[0.97]"
              >
                {/* POSTER */}
                <div className="relative h-[200px] overflow-hidden">
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
                  <h4 className="line-clamp-1 text-sm font-bold text-white">
                    {movie.title}
                  </h4>
                  {movie.vote_average > 0 && (
                    <p className="mt-1 text-xs text-yellow-300">
                      ⭐ {movie.vote_average?.toFixed(1)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}