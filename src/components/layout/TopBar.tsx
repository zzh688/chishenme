import { Search, Shuffle } from 'lucide-react'

interface TopBarProps {
  title: string
  onSearchClick?: () => void
  onRandomClick?: () => void
  showActions?: boolean
}

export default function TopBar({ title, onSearchClick, onRandomClick, showActions = true }: TopBarProps) {
  return (
    <header className="bg-white border-b border-[#E8E8E0] px-4 py-3 flex items-center justify-between shrink-0">
      <h1 className="text-lg font-semibold text-[#333]">{title}</h1>
      {showActions && (
        <div className="flex items-center gap-2">
          <button
            onClick={onSearchClick}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#666] hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <Search size={20} />
          </button>
          <button
            onClick={onRandomClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white bg-[#7DB892] hover:bg-[#6AA87E] active:scale-95 transition-all"
          >
            <Shuffle size={16} />
            随机
          </button>
        </div>
      )}
    </header>
  )
}
