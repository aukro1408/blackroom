import { Outlet } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'

export default function MainLayout() {
  return (
    <div className="min-h-screen pb-[calc(80px+env(safe-area-inset-bottom,20px))]">
      <Outlet />
      <BottomNavigation />
    </div>
  )
}