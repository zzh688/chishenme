import { useState } from 'react'
import { X, Shuffle, Clock3, Sun, Moon, Sunrise } from 'lucide-react'
import type { Dish, MealTime } from '../../types'

interface RandomPickerProps {
  onGenerate: (mealTimes: MealTime[]) => void
  onClose: () => void
}

export default function RandomPicker({ onGenerate, onClose }: RandomPickerProps) {
  const [selected, setSelected] = useState<Set<MealTime>>(new Set())

  const toggle = (mt: MealTime) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(mt)) next.delete(mt)
      else next.add(mt)
      return next
    })
  }

  const handleGenerate = () => {
    const mealTimes = selected.size > 0 ? Array.from(selected) : ['breakfast', 'lunch', 'dinner'] as MealTime[]
    onGenerate(mealTimes)
    onClose()
  }

  const items: { key: MealTime; label: string; icon: typeof Shuffle; color: string }[] = [
    { key: 'breakfast', label: '早餐', icon: Sunrise, color: '#E0B86A' },
    { key: 'lunch', label: '午餐', icon: Sun, color: '#E0746A' },
    { key: 'dinner', label: '晚餐', icon: Moon, color: '#6A8EE0' },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl w-full max-w-lg px-5 pt-5 pb-8 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#333] text-lg">随机配餐</h3>
          <button onClick={onClose} className="text-[#999]"><X size={22} /></button>
        </div>

        <p className="text-sm text-[#999] mb-4">选择你要随机生成的餐段（不选则默认三餐全随）</p>

        <div className="flex gap-3 mb-6">
          {items.map(({ key, label, icon: Icon }) => {
            const active = selected.has(key)
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`flex-1 py-4 rounded-xl flex flex-col items-center gap-2 transition-all border-2 ${
                  active
                    ? 'border-[#7DB892] bg-[#E8F5EC]'
                    : 'border-[#E8E8E0] bg-white'
                }`}
              >
                <Icon size={28} className={active ? 'text-[#7DB892]' : 'text-[#ccc]'} />
                <span className={`text-sm font-medium ${active ? 'text-[#7DB892]' : 'text-[#999]'}`}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-3.5 rounded-xl bg-[#7DB892] text-white font-medium text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Shuffle size={20} />
          开始随机配餐
        </button>
      </div>
    </div>
  )
}
