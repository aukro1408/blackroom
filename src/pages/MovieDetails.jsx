import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import BottomNavigation from '../components/BottomNavigation'
import { isFavorite, toggleFavorite } from '../utils/favorites'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } }
}

const contentVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const titleVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

const fadeInVariants = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: 'easeOut' } }
})

const staggerContainer = {
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

export default function MovieDetails() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [movie, setMovie] = useState(null)
  const [actors, setActors] = useState([])
  const [director, setDirector] = useState(null)
  const [trailer, setTrailer] = useState(null)
  const [similarMovies, setSimilarMovies] = useState([])

  useEffect(() => {

    fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=ru-RU`,
      {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OGU2ZmI2NmI5MWFhOGYwZTFmMmI4Y2YzYmIxMzQyZSIsIm5iZiI6MTY1MDM2NDc2NS43NDMsInN1YiI6IjYyNWU5MTVkMmQzNzIxMTViMTAzZTk1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cqdQjwctMj2HWwkEDD6f7-TV-g0sEv2aeULnKa8cLFY'
        }
      }
    )
      .then((res) => res.json())
      .then((data) => {

        setMovie(data)

        fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?language=ru-RU`,
          {
            headers: {
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OGU2ZmI2NmI5MWFhOGYwZTFmMmI4Y2YzYmIxMzQyZSIsIm5iZiI6MTY1MDM2NDc2NS43NDMsInN1YiI6IjYyNWU5MTVkMmQzNzIxMTViMTAzZTk1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cqdQjwctMj2HWwkEDD6f7-TV-g0sEv2aeULnKa8cLFY'
            }
          }
        )
          .then((res) => res.json())
          .then((creditsData) => {
            setActors(creditsData.cast.slice(0, 10))
            // Find director from crew
            const directorData = creditsData.crew?.find(
              (member) => member.job === 'Director'
            )
            if (directorData) {
              setDirector(directorData)
            }
          })

        // Fetch similar movies
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?language=ru-RU`,
          {
            headers: {
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OGU2ZmI2NmI5MWFhOGYwZTFmMmI4Y2YzYmIxMzQyZSIsIm5iZiI6MTY1MDM2NDc2NS43NDMsInN1YiI6IjYyNWU5MTVkMmQzNzIxMTViMTAzZTk1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cqdQjwctMj2HWwkEDD6f7-TV-g0sEv2aeULnKa8cLFY'
            }
          }
        )
          .then((res) => res.json())
          .then((similarData) => {
            setSimilarMovies(similarData.results?.slice(0, 10) || [])
          })

        // Fetch videos/trailer
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?language=ru-RU`,
          {
            headers: {
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OGU2ZmI2NmI5MWFhOGYwZTFmMmI4Y2YzYmIxMzQyZSIsIm5iZiI6MTY1MDM2NDc2NS43NDMsInN1YiI6IjYyNWU5MTVkMmQzNzIxMTViMTAzZTk1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cqdQjwctMj2HWwkEDD6f7-TV-g0sEv2aeULnKa8cLFY'
            }
          }
        )
          .then((res) => res.json())
          .then((videosData) => {
            const trailerData = videosData.results?.find(
              (video) => video.site === 'YouTube' && video.type === 'Trailer'
            )
            if (trailerData) {
              setTrailer(trailerData)
            }
          })

      })

  }, [id])

  if (!movie) {

    return (

      <div className="flex min-h-screen items-center justify-center text-white">
        Загрузка...
      </div>

    )

  }

  return (

    <div className="min-h-screen pb-36">

      {/* BACKDROP */}

      <div className="relative h-[420px] overflow-hidden">

        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#30384a] to-transparent" />

      </div>

      {/* CONTENT */}

      <div className="relative z-10 -mt-24 px-4">

        <div className="relative rounded-[32px] bg-white/10 p-5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] animate-card-enter">
          {/* HEART BUTTON */}
          <motion.button
            onClick={() => {
              toggleFavorite(movie)
              setMovie({ ...movie }) // Force re-render to update icon
            }}
            whileTap={{ scale: 0.85 }}
            className={`absolute top-5 right-5 z-10 rounded-full p-3 backdrop-blur-md transition-all duration-200 ${
              isFavorite(movie.id)
                ? 'bg-red-500/20 ring-1 ring-red-500/30'
                : 'bg-black/30 ring-1 ring-white/10 hover:bg-black/50'
            }`}
          >
            <Heart
              size={22}
              className={`transition-all duration-200 ${
                isFavorite(movie.id)
                  ? 'fill-red-500 text-red-500'
                  : 'fill-none text-white'
              }`}
              strokeWidth={2.5}
            />
          </motion.button>

          <h1 className="text-[32px] font-black leading-none text-white pr-14">
            {movie.title}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-slate-200">

            <span>
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>

            <span>
              {movie.release_date?.slice(0, 4)}
            </span>

          </div>

          <p className="mt-5 text-sm leading-7 text-slate-100">
            {movie.overview}
          </p>

          {/* DIRECTOR */}
          {director && (
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-bold text-white">
                Режиссёр
              </h3>
              <div
                onClick={() => navigate(`/actor/${director.id}`)}
                className="flex cursor-pointer items-center gap-4 rounded-2xl bg-white/5 p-4 backdrop-blur-md transition-all duration-200 active:scale-95"
              >
                {director.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${director.profile_path}`}
                    className="h-[70px] w-[70px] rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white/10 text-3xl">
                    🎬
                  </div>
                )}
                <span className="text-lg font-semibold text-white">
                  {director.name}
                </span>
              </div>
            </div>
          )}

          {/* TRAILER */}
          {trailer && (
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-bold text-white">
                Трейлер
              </h3>
              <div className="overflow-hidden rounded-[24px] bg-white/5">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  className="aspect-video w-full"
                  allowFullScreen
                  title="Трейлер"
                />
              </div>
            </div>
          )}

          {/* INFO */}

          <div className="mt-8 space-y-4">

            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <span className="text-slate-300">Дата выхода</span>

              <span className="font-semibold text-white">
                {movie.release_date}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <span className="text-slate-300">Длительность</span>

              <span className="font-semibold text-white">
                {movie.runtime} мин
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <span className="text-slate-300">Страна</span>

              <span className="font-semibold text-white">
                {movie.production_countries?.[0]?.name}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <span className="text-slate-300">Бюджет</span>

              <span className="font-semibold text-white">
                ${movie.budget?.toLocaleString()}
              </span>
            </div>

          </div>

          {/* GENRES */}

          <div className="mt-5 flex flex-wrap gap-2">

            {movie.genres?.map((genre) => (

              <div
                key={genre.id}
                className="rounded-full bg-white/10 px-4 py-2 text-xs text-white"
              >
                {genre.name}
              </div>

            ))}

          </div>

          {/* ACTORS */}

          <div className="mt-10">

            <h2 className="mb-4 text-2xl font-black text-white">
              Актёры
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-2">

              {actors.map((actor) => (

                <div
                  key={actor.id}
                  onClick={() => navigate(`/actor/${actor.id}`)}
                  className="min-w-[120px] cursor-pointer rounded-3xl bg-white/5 p-3 backdrop-blur-md transition-all duration-200 active:scale-95"
                >

                  {actor.profile_path ? (

                    <img
                      src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                      className="h-[150px] w-full rounded-2xl object-cover"
                    />

                  ) : (

                    <div className="flex h-[150px] items-center justify-center rounded-2xl bg-white/10 text-5xl">
                      🎭
                    </div>

                  )}

                  <h3 className="mt-3 line-clamp-2 text-sm font-bold text-white">
                    {actor.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs text-slate-300">
                    {actor.character}
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* SIMILAR MOVIES */}

          {similarMovies.length > 0 && (
            <div className="mt-10">

              <h2 className="mb-4 text-2xl font-black text-white">
                Похожие фильмы
              </h2>

              <div className="flex gap-4 overflow-x-auto pb-2">

                {similarMovies.map((movie, index) => (
                  <div
                    key={`${movie.id}-${index}`}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="min-w-[140px] cursor-pointer rounded-3xl bg-white/5 p-3 backdrop-blur-md transition-all duration-200 active:scale-95"
                  >
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        className="h-[180px] w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-[180px] items-center justify-center rounded-2xl bg-white/10 text-4xl">
                        🎬
                      </div>
                    )}

                    <h3 className="mt-3 line-clamp-2 text-sm font-bold text-white">
                      {movie.title}
                    </h3>

                    {movie.vote_average > 0 && (
                      <p className="mt-1 text-xs text-yellow-300">
                        ⭐ {movie.vote_average?.toFixed(1)}
                      </p>
                    )}
                  </div>
                ))}

              </div>

            </div>
          )}

        </div>

      </div>

      <BottomNavigation />

    </div>

  )
}