import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import horrorImg from '../../horror.jpg'
import movieImg from '../../movie.jpg'
import detectiveImg from '../../detective.jpg'
import homeMusic from '../../home.mp3'

export default function Home() {
  const navigate = useNavigate()
  const audioRef = useRef(null)
  const [showMusicBtn, setShowMusicBtn] = useState(true)

  useEffect(() => {
    const audio = new Audio(homeMusic)
    audio.loop = true
    audio.volume = 0.25
    audioRef.current = audio

    const startMusic = () => {
      audio.play().catch(() => {
        // Autoplay blocked; will retry on next interaction
      })
    }

    window.addEventListener('click', startMusic, { once: true })

    return () => {
      window.removeEventListener('click', startMusic)
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  const handleMusicClick = () => {
    if (!audioRef.current) return
    audioRef.current.play().then(() => {
      setShowMusicBtn(false)
    }).catch(() => {
      // Playback failed, keep button visible
    })
  }

return ( <div className="min-h-screen px-4 pt-4 pb-10">

```
  {/* HEADER */}

  <div className="mb-7">

    <h1 className="text-white text-[42px] font-black tracking-[-2px]">
      BLACKROOM
    </h1>

    <p className="mt-1 text-sm text-slate-200">
      ИИ создаёт истории. Ты выбираешь путь.
    </p>

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

      <p className="mt-3 max-w-[240px] text-sm leading-6 text-slate-200">
        Погрузись в страшные истории,
        где каждое решение имеет последствия.
      </p>

      <button className="mt-4 w-fit rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white">
        Играть
      </button>

    </div>

  </div>

  {/* CARD 2 */}

  <div
    onClick={() => navigate('/movie')}
    className="relative mb-5 h-[240px] overflow-hidden rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-200 active:scale-[0.98]"
  >

    <img
      src={movieImg}
      className="absolute inset-0 h-full w-full object-cover"
    />

    <div className="absolute inset-0 bg-black/30" />

    <div className="relative z-10 flex h-full flex-col justify-end p-5">

      <h2 className="text-[34px] font-black leading-none text-white">
        УГАДАЙ ФИЛЬМ
      </h2>

      <p className="mt-3 max-w-[240px] text-sm leading-6 text-slate-200">
        Угадай фильм по кадру,
        описанию или эмодзи.
      </p>

      <button className="mt-4 w-fit rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black">
        Начать
      </button>

    </div>

  </div>

  {/* CARD 3 */}

  <div
    onClick={() => navigate('/detective')}
    className="relative h-[240px] overflow-hidden rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-200 active:scale-[0.98]"
  >

    <img
      src={detectiveImg}
      className="absolute inset-0 h-full w-full object-cover"
    />

    <div className="absolute inset-0 bg-black/45" />

    <div className="relative z-10 flex h-full flex-col justify-end p-5">

      <h2 className="text-[32px] font-black leading-none text-white">
        РАССЛЕДОВАНИЕ
      </h2>

      <p className="mt-3 max-w-[240px] text-sm leading-6 text-slate-200">
        Допрашивай подозреваемых,
        собирай улики и находи истину.
      </p>

      <button className="mt-4 w-fit rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-black">
        Расследовать
      </button>

    </div>

  </div>

  {showMusicBtn && (
    <button
      onClick={handleMusicClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/20 transition-all duration-200 active:scale-95 hover:bg-white/20"
 theological>
      🔊 Включить атмосферу
    </button>
  )}

</div>

)
}
