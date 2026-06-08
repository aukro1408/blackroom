import horrorImg from '../horror.jpg'
import movieImg from '../movie.jpg'
import detectiveImg from '../detective.jpg'

export default function App() {
  return (
    <div className="min-h-screen px-4 pt-4 pb-10">

      {/* HEADER */}

      <div className="mb-7">

        <h1 className="text-white text-[42px] font-black tracking-[-2px]">
          BLACKROOM
        </h1>

        <p className="text-slate-200 text-sm mt-1">
          ИИ создаёт истории. Ты выбираешь путь.
        </p>

      </div>

      {/* CARD 1 */}

      <div className="relative h-[240px] overflow-hidden rounded-[36px] mb-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

        <img
          src={horrorImg}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-full flex-col justify-end p-5">

          <h2 className="text-white text-[38px] font-black leading-none">
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

      <div className="relative h-[240px] overflow-hidden rounded-[36px] mb-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

        <img
          src={movieImg}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex h-full flex-col justify-end p-5">

          <h2 className="text-white text-[34px] font-black leading-none">
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

      <div className="relative h-[240px] overflow-hidden rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

        <img
          src={detectiveImg}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex h-full flex-col justify-end p-5">

          <h2 className="text-white text-[32px] font-black leading-none">
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

    </div>
  )
}