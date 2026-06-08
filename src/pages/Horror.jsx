import horrorImg from '../../horror.jpg'

export default function Horror() {

return (
<div className="relative min-h-screen overflow-hidden">

  <img
    src={horrorImg}
    className="absolute inset-0 h-full w-full object-cover"
  />

  <div className="absolute inset-0 bg-black/60" />

  <div className="relative z-10 flex min-h-screen flex-col justify-end p-5">

    <div className="rounded-[34px] bg-white/10 p-5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

      <p className="text-sm text-slate-300">
        Глава 1
      </p>

      <h1 className="mt-2 text-3xl font-black text-white">
        НЕ ОТВЕЧАЙ ПОСЛЕ 03:00
      </h1>

      <p className="mt-4 leading-7 text-slate-200">
        Телефон снова вибрирует.

        Сообщение пришло
        с номера твоего брата.

        Но он умер неделю назад.
      </p>

      <div className="mt-6 flex flex-col gap-3">

        <button className="rounded-2xl bg-white/10 p-4 text-left text-white backdrop-blur-xl">
          Открыть сообщение
        </button>

        <button className="rounded-2xl bg-white/10 p-4 text-left text-white backdrop-blur-xl">
          Заблокировать номер
        </button>

        <button className="rounded-2xl bg-white/10 p-4 text-left text-white backdrop-blur-xl">
          Позвонить в полицию
        </button>

      </div>

    </div>

  </div>

</div>

)
}