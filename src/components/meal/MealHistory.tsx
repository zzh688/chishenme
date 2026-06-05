import type { MealRecord, MealTime } from '../../types'
import { mealTimeLabels } from '../../utils/storage'
import { Calendar, Trash2 } from 'lucide-react'

interface MealHistoryProps {
  records: MealRecord[]
  onRemove: (id: number) => void
}

// 按日期分组
function groupByDate(records: MealRecord[]): Map<string, MealRecord[]> {
  const map = new Map<string, MealRecord[]>()
  for (const r of records) {
    const list = map.get(r.date) || []
    list.push(r)
    map.set(r.date, list)
  }
  return map
}

const MEAL_ORDER: Record<MealTime, number> = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 }

export default function MealHistory({ records, onRemove }: MealHistoryProps) {
  const grouped = groupByDate(records)

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[#ccc]">
        <Calendar size={40} strokeWidth={1} />
        <p className="mt-2 text-sm text-[#bbb]">暂无用餐记录</p>
        <p className="text-xs text-[#ccc] mt-1">选择菜品后点击"吃了这个"即可记录</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {Array.from(grouped.entries()).map(([date, items]) => {
        const sorted = [...items].sort((a, b) => (MEAL_ORDER[a.mealTime] ?? 4) - (MEAL_ORDER[b.mealTime] ?? 4))
        return (
          <div key={date} className="bg-white rounded-xl border border-[#E8E8E0] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAFAF5] border-b border-[#F0F0EB]">
              <span className="text-xs font-medium text-[#999]">{date}</span>
              <span className="text-xs text-[#ccc]">{sorted.length}餐</span>
            </div>
            <div className="divide-y divide-[#F5F5F0]">
              {sorted.map(r => (
                <div key={r.id} className="flex items-center px-4 py-2.5 gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[#E8F5EC] text-[#5A9A6E] shrink-0">
                    {mealTimeLabels[r.mealTime] || r.mealTime}
                  </span>
                  <span className="flex-1 text-sm text-[#333] truncate">{r.dishName}</span>
                  <button
                    onClick={() => r.id != null && onRemove(r.id)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[#ddd] hover:text-[#E0746A] hover:bg-red-50 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
