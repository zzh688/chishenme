import { RefreshCw, Check } from 'lucide-react'
import type { MealPlan, Dish, MealTime } from '../../types'
import { formatPrice, mealTimeLabels, difficultyLabels } from '../../utils/storage'

interface MealPlanCardProps {
  plan: MealPlan
  loading: boolean
  onRegenerate: (mealTimes: MealTime[]) => void
  onSelectDish: (dish: Dish, mealTime: MealTime) => void
  todayMealTimes: MealTime[]
}

const SLOTS: { key: MealTime; label: string; emoji: string }[] = [
  { key: 'breakfast', label: '早餐', emoji: '🌅' },
  { key: 'lunch', label: '午餐', emoji: '☀️' },
  { key: 'dinner', label: '晚餐', emoji: '🌙' },
]

export default function MealPlanCard({ plan, loading, onRegenerate, onSelectDish, todayMealTimes }: MealPlanCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E8E0] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E8E0]">
        <h3 className="font-semibold text-[#333]">今日推荐</h3>
        <button
          onClick={() => onRegenerate(SLOTS.map(s => s.key))}
          disabled={loading}
          className="flex items-center gap-1 text-xs text-[#7DB892] font-medium px-2.5 py-1.5 rounded-full bg-[#E8F5EC] hover:bg-[#d0ebd8] active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          换一批
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={24} className="animate-spin text-[#7DB892]" />
        </div>
      ) : (
        <div className="divide-y divide-[#F0F0EB]">
          {SLOTS.map(({ key, label, emoji }) => {
            const dish = plan[key]
            const eaten = todayMealTimes.includes(key)
            return (
              <div key={key} className="flex items-center px-4 py-3 gap-3">
                <span className="text-lg">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-[#999]">{label}</span>
                  {dish ? (
                    <div>
                      <p className="font-medium text-[#333] text-sm truncate">{dish.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[#7DB892]">{formatPrice(dish.price)}</span>
                        <span className="text-xs text-[#999]">{difficultyLabels[dish.difficulty]}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#ccc]">暂无推荐菜品</p>
                  )}
                </div>
                {dish && !eaten && (
                  <button
                    onClick={() => onSelectDish(dish, key)}
                    className="shrink-0 w-8 h-8 rounded-full bg-[#7DB892] text-white flex items-center justify-center active:scale-90 transition-all"
                  >
                    <Check size={18} />
                  </button>
                )}
                {eaten && (
                  <span className="text-xs text-[#bbb] shrink-0">已记录</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
