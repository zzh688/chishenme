import { Pin, PinOff, ChevronUp, ChevronDown, MoreVertical } from 'lucide-react'
import type { Dish } from '../../types'
import { formatPrice, mealTimeLabels, difficultyLabels, difficultyColors } from '../../utils/storage'
import { useState } from 'react'

interface DishCardProps {
  dish: Dish
  isFirst: boolean
  isLast: boolean
  onTogglePin: (id: number, pinned: boolean) => void
  onMove: (id: number, direction: 'up' | 'down') => void
  onClick: (dish: Dish) => void
  onRecordMeal?: (dish: Dish) => void
  showRecordButton?: boolean
}

export default function DishCard({
  dish, isFirst, isLast,
  onTogglePin, onMove, onClick, onRecordMeal, showRecordButton,
}: DishCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  if (!dish.id) return null

  return (
    <div
      className="bg-white rounded-xl border border-[#E8E8E0] overflow-hidden shadow-sm card-active relative"
    >
      {/* 主内容区 */}
      <div className="flex p-3 gap-3" onClick={() => onClick(dish)}>
        {/* 图片 */}
        {dish.imageDataUrl ? (
          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
            <img src={dish.imageDataUrl} alt={dish.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg shrink-0 bg-gradient-to-br from-[#E8F5EC] to-[#F0F0EB] flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
        )}

        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-[#333] truncate text-[15px]">
              {dish.isPinned && <Pin size={12} className="inline mr-1 text-[#7DB892]" />}
              {dish.name}
            </h3>
            <span className="text-sm font-medium text-[#7DB892] shrink-0">
              {formatPrice(dish.price)}
            </span>
          </div>

          {/* 标签行 */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            <span className={`text-xs px-1.5 py-0.5 rounded ${difficultyColors[dish.difficulty]}`}>
              {difficultyLabels[dish.difficulty]}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
              {dish.cuisine}
            </span>
            {dish.mealTime.map(mt => (
              <span key={mt} className="text-xs px-1.5 py-0.5 rounded bg-[#E8F5EC] text-[#5A9A6E]">
                {mealTimeLabels[mt]}
              </span>
            ))}
          </div>

          {/* 食材 */}
          {dish.ingredients.length > 0 && (
            <p className="text-xs text-[#999] mt-1 truncate">
              {dish.ingredients.join('、')}
            </p>
          )}
        </div>
      </div>

      {/* 操作栏 */}
      <div className="flex items-center justify-end gap-1 px-2 pb-2">
        {showRecordButton && (
          <button
            onClick={(e) => { e.stopPropagation(); onRecordMeal?.(dish) }}
            className="text-xs px-2 py-1 rounded-md text-[#7DB892] bg-[#E8F5EC] hover:bg-[#d0ebd8] active:scale-95 transition-all"
          >
            吃了这个
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#bbb] hover:bg-gray-100"
        >
          <MoreVertical size={16} />
        </button>
        {!isFirst && (
          <button
            onClick={(e) => { e.stopPropagation(); onMove(dish.id!, 'up') }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#999] hover:bg-gray-100"
          >
            <ChevronUp size={16} />
          </button>
        )}
        {!isLast && (
          <button
            onClick={(e) => { e.stopPropagation(); onMove(dish.id!, 'down') }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#999] hover:bg-gray-100"
          >
            <ChevronDown size={16} />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePin(dish.id!, !dish.isPinned) }}
          className={`w-7 h-7 rounded-full flex items-center justify-center ${
            dish.isPinned ? 'text-[#7DB892]' : 'text-[#bbb]'
          } hover:bg-gray-100`}
        >
          {dish.isPinned ? <Pin size={16} fill="#7DB892" /> : <PinOff size={16} />}
        </button>
      </div>

      {/* 下拉菜单 */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-2 bottom-12 z-20 bg-white rounded-lg shadow-lg border border-[#E8E8E0] py-1 min-w-[100px]">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onClick(dish) }}
              className="w-full text-left px-3 py-2 text-sm text-[#333] hover:bg-gray-50"
            >
              查看详情
            </button>
          </div>
        </>
      )}
    </div>
  )
}
