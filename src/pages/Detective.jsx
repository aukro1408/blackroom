import detectiveImg from '../../detective.jpg'

export default function Detective() {

return (
<div className="relative min-h-screen overflow-hidden">

  <img
    src={detectiveImg}
    className="absolute inset-0 h-full w-full object-cover"
  />

  <div className="absolute inset-0 bg-black/70" />

  <div className="relative z-10 flex min-h-screen flex-col justify-end p-5">

    <div className="rounded-[34px] bg-white/10 p-5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

      <p className="text-sm text-cyan-300">
        Дело №148
      </p>

      <h1 className="mt-2 text-3xl font-black text-white">
        ПРОПАВШИЙ СВИДЕТЕЛЬ
      </h1>

      <p className="mt-4 leading-7 text-slate-200">
        Единственный свидетель
        по делу исчез за день
        до суда.

        На его столе найден
        только странный ключ.
      </p>

      <div className="mt-6 flex flex-col gap-3">

        <button className="rounded-2xl bg-white/10 p-4 text-left text-white backdrop-blur-xl">
          Осмотреть квартиру
        </button>

        <button className="rounded-2xl bg-white/10 p-4 text-left text-white backdrop-blur-xl">
          Допросить соседей
        </button>

        <button className="rounded-2xl bg-cyan-400 p-4 text-left font-bold text-black">
          Изучить ключ
        </button>

      </div>

    </div>

  </div>

</div>

)
}