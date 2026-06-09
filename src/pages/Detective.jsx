import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Detective() {

  const navigate = useNavigate()

  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMovies(page)
  }, [page])

  const loadMovies = async (currentPage) => {

    if (loading) return

    setLoading(true)

    try {

      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_genres=878&language=ru-RU&page=${currentPage}`,
        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OGU2ZmI2NmI5MWFhOGYwZTFmMmI4Y2YzYmIxMzQyZSIsIm5iZiI6MTY1MDM2NDc2NS43NDMsInN1YiI6IjYyNWU5MTVkMmQzNzIxMTViMTAzZTk1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cqdQjwctMj2HWwkEDD6f7-TV-g0sEv2aeULnKa8cLFY'
          }
        }
      )

      const data = await response.json()

      setMovies((prev) => [...prev, ...data.results])

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    const handleScroll = () => {

      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollTop + windowHeight + 300 >= documentHeight && !loading) {
        setPage((prev) => prev + 1)
      }

    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)

  }, [loading])

  return (

    <div className="min-h-screen px-4 pt-6 pb-24">

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-[38px] font-black tracking-[-2px] text-white">
          ФАНТАСТИКА
        </h1>

        <p className="mt-1 text-sm text-slate-200">
          Космос, технологии и миры будущего.
        </p>

      </div>

      {/* MOVIES GRID */}

      <div className="grid grid-cols-2 gap-4">

        {movies.map((movie) => (

          <div
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="overflow-hidden rounded-[28px] bg-white/5 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-200 active:scale-[0.97]"
          >

            {/* POSTER */}

            <div className="relative h-[230px] overflow-hidden">

              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/20" />

            </div>

            {/* INFO */}

            <div className="p-3">

              <h2 className="line-clamp-1 text-sm font-bold text-white">
                {movie.title}
              </h2>

              <p className="mt-1 text-xs text-cyan-300">
                ⭐ {movie.vote_average?.toFixed(1)}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  )
}