import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/layout/BottomNav'
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import TempDishPage from './pages/TempDishPage'
import TakeoutPage from './pages/TakeoutPage'
import SettingsPage from './pages/SettingsPage'
import { cleanExpiredDishes } from './db/dishes'

export default function App() {
  useEffect(() => {
    cleanExpiredDishes().then(cleaned => {
      if (cleaned > 0) {
        console.log(`自动清理了 ${cleaned} 个过期菜品`)
      }
    })
  }, [])

  return (
    <HashRouter>
      <div className="h-full flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<CollectionPage />} />
          <Route path="/temp" element={<TempDishPage />} />
          <Route path="/takeout" element={<TakeoutPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  )
}
