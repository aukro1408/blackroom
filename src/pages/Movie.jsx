import movieImg from '../../movie.jpg'

export default function Movie() {

return (
<div className="relative min-h-screen overflow-hidden">

  <img
    src={movieImg}
    className="absolute inset-0 h-full w-full object-cover"
  />

  <div className="absolute inset-0 bg-black/65" />

  <div className="relative z-10 flex min-h-screen flex-col justify-end p-5">

    <div className="rounded-[34px] bg-white/10 p-5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

      <p className="text-sm text-yellow-300">
        Вопрос 1
      </p>

      <h1 className="mt-2 text-3xl font-black text-white">
        УГАДАЙ ФИЛЬМ
      </h1>

      <p className="mt-4 leading-7 text-slate-200">
        Фильм о человеке,
        который обнаружил,
        что весь его мир —
        это симуляция.
      </p>

      <div className="mt-6 flex flex-col gap-3">

        <button className="rounded-2xl bg-white/10 p-4 text-left text-white backdrop-blur-xl">
          Интерстеллар
        </button>

        <button className="rounded-2xl bg-yellow-400 p-4 text-left font-bold text-black">
          Матрица
        </button>

        <button className="rounded-2xl bg-white/10 p-4 text-left text-white backdrop-blur-xl">
          Начало
        </button>

        <button className="rounded-2xl bg-white/10 p-4 text-left text-white backdrop-blur-xl">
          Бегущий по лезвию
        </button>

      </div>

    </div>

  </div>

</div>

)
}