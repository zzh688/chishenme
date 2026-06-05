import type { Dish } from '../../types'
import DishCard from './DishCard'
import { Utensils } from 'lucide-react'

interface DishListProps {
  dishes: Dish[]
  loading: boolean
  onTogglePin: (id: number, pinned: boolean) => void
  onMove: (id: number, direction: 'up' | 'down') => void
  onDishClick: (dish: Dish) => void
  onRecordMeal?: (dish: Dish) => void
  showRecordButton?: boolean
  emptyText?: string
}

export default function DishList({
  dishes, loading,
  onTogglePin, onMove, onDishClick, onRecordMeal,
  showRecordButton, emptyText = '还没有菜品，点击右下角 + 添加',
}: DishListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#bbb]">
        <div className="w-8 h-8 border-2 border-[#E8E8E0] border-t-[#7DB892] rounded-full animate-spin mb-3" />
        <span className="text-sm">加载中</span>
      </div>
    )
  }

  if (dishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#ccc]">
        <Utensils size={48} strokeWidth={1} />
        <p className="mt-3 text-sm text-[#bbb]">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5 pb-4">
      {dishes.map((dish, i) => (
        <DishCard
          key={dish.id}
          dish={dish}
          isFirst={i === 0}
          isLast={i === dishes.length - 1}
          onTogglePin={onTogglePin}
          onMove={onMove}
          onClick={onDishClick}
          onRecordMeal={onRecordMeal}
          showRecordButton={showRecordButton}
        />
      ))}
    </div>
  )
}
