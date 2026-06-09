import { useNavigate } from 'react-router-dom'

import horrorImg from '../../horror.jpg'
import movieImg from '../../movie.jpg'
import detectiveImg from '../../detective.jpg'
import BottomNavigation from '../components/BottomNavigation'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen px-4 pt-4 pb-10">

      {/* HEADER */}

      <div className="mb-7 relative">

        <div className="glitch-wrapper">
          <h1
            className="glitch-text text-white text-[42px] font-black tracking-[-2px]"
            data-text="BLACKROOM"
          >
            BLACKROOM
          </h1>
        </div>

        {/* Search Button */}
        <button
          onClick={() => navigate('/search')}
          className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/20 transition-all duration-200 active:scale-95 hover:bg-white/20"
          aria-label="Поиск"
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>

      </div>

      {/* CARD 1 */}

      <div
        onClick={() => navigate('/horror')}
        className="relative mb-5 h-[240px] overflow-hidden rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-200 active:scale-[0.98]"
      >

        <img
          src={horrorImg}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-full flex-col justify-end p-5">

          <h2 className="text-[38px] font-black leading-none text-white">
            УЖАСЫ
          </h2>

          <button className="mt-4 w-fit rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white">
            Смотреть
          </button>

        </div>

      </div>

      {/* CARD 2 */}

      <div
        onClick={() => navigate('/thriller')}
        className="relative mb-5 h-[240px] overflow-hidden rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-200 active:scale-[0.98]"
      >

        <img
          src={movieImg}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex h-full flex-col justify-end p-5">

          <h2 className="text-[34px] font-black leading-none text-white">
            ТРИЛЛЕРЫ
          </h2>

          <button className="mt-4 w-fit rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black">
            Смотреть
          </button>

        </div>

      </div>

      {/* CARD 3 */}

      <div
        onClick={() => navigate('/scifi')}
        className="relative h-[240px] overflow-hidden rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-200 active:scale-[0.98]"
      >

        <img
          src={detectiveImg}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex h-full flex-col justify-end p-5">

          <h2 className="text-[32px] font-black leading-none text-white">
            ФАНТАСТИКА
          </h2>

          <button className="mt-4 w-fit rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-black">
            Смотреть
          </button>

        </div>

      </div>

      <BottomNavigation />

    </div>
  )
}