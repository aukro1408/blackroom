import { NavLink } from 'react-router-dom'
import { Home, Search, Heart } from 'lucide-react'

export default function BottomNavigation() {
  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Главная'
    },
    {
      path: '/search',
      icon: Search,
      label: 'Поиск'
    },
    {
      path: '/favorites',
      icon: Heart,
      label: 'Избранное'
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
      <div className="mx-4 mb-4 rounded-[24px] bg-slate-800/70 backdrop-blur-xl ring-1 ring-white/10">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative p-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                        : ''
                    }`}
                  >
                    <item.icon
                      size={22}
                      strokeWidth={2.5}
                    />
                    {isActive && (
                      <span className="absolute inset-0 rounded-xl bg-white/5 blur-sm" />
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-medium transition-all duration-200 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}