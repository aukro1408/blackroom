import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function CollectionPage() {

  const navigate = useNavigate()
  const { type } = useParams()

  const [movies, setMovies] = useState([])

  const collections = {
    trending: {
      title: '🔥 Сейчас смотрят',
      endpoint: '/trending/movie/day'
    },

    popular: {
      title: '🍿 Популярное',
      endpoint: '/movie/popular'
    },

    top: {
      title: '🏆 Топ рейтинг',
      endpoint: '/movie/top_rated'
    },

    upcoming: {
      title: '🎬 Скоро выйдут',
      endpoint: '/movie/upcoming'
    }
  }

  const currentCollection = collections[type]

  useEffect(() => {

    loadMovies()

  }, [type])

  const loadMovies = async () => {

    if (!currentCollection) return

    try {

      const url =
        'https://api.themoviedb.org/3' +
        currentCollection.endpoint +
        '?language=ru-RU&page=1'

      const response = await fetch(url, {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OGU2ZmI2NmI5MWFhOGYwZTFmMmI4Y2YzYmIxMzQyZSIsIm5iZiI6MTY1MDM2NDc2NS43NDMsInN1YiI6IjYyNWU5MTVkMmQzNzIxMTViMTAzZTk1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cqdQjwctMj2HWwkEDD6f7-TV-g0sEv2aeULnKa8cLFY'
        }
      })

      const data = await response.json()

      setMovies(data.results || [])

    } catch (error) {

      console.error(error)

    }

  }

  if (!currentCollection) {

    return (
      <div className="p-6 text-white">
        Коллекция не найдена
      </div>
    )

  }

  return (

    <div className="min-h-screen px-4 pt-6 pb-24">

      <button
        onClick={() => navigate(-1)}
        className="mb-6 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white"
      >
        ← Назад
      </button>

      <h1 className="mb-6 text-[38px] font-black tracking-[-2px] text-white">
        {currentCollection.title}
      </h1>

      <div className="grid grid-cols-2 gap-4">

        {movies.map((movie) => (

          <div
            key={movie.id}
            onClick={() => navigate('/movie/' + movie.id)}
            className="overflow-hidden rounded-[28px] bg-white/5 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-200 active:scale-[0.97]"
          >

            <div className="relative h-[230px] overflow-hidden">

              <img
                src={
                  movie.poster_path
                    ? 'https://image.tmdb.org/t/p/w342' + movie.poster_path
                    : 'https://placehold.co/300x450/111/FFF?text=NO+IMAGE'
                }
                alt={movie.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/20" />

            </div>

            <div className="p-3">

              <h2 className="line-clamp-1 text-sm font-bold text-white">
                {movie.title}
              </h2>

              <p className="mt-1 text-xs text-red-300">
                ⭐ {movie.vote_average?.toFixed(1)}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}