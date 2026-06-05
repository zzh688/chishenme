import { Home, Heart, ShoppingBag, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/', label: '首页', icon: Home },
  { path: '/favorites', label: '收藏', icon: Heart },
  { path: '/takeout', label: '外卖', icon: ShoppingBag },
  { path: '/settings', label: '我的', icon: User },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      className="bg-white border-t border-[#E8E8E0] flex shrink-0 safe-bottom"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {tabs.map(tab => {
        const active = isActive(tab.path)
        const Icon = tab.icon
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
              active ? 'text-[#7DB892]' : 'text-[#999]'
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span className="text-xs">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
