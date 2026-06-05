import { X } from 'lucide-react'
import type { Cuisine, Difficulty, MealTime, Category } from '../../types'

interface FilterPanelProps {
  onClose: () => void
  cuisine: Cuisine | '全部'
  mealTime: MealTime | '全部'
  difficulty: Difficulty | '全部'
  category: Category | '全部'
  priceMin: string
  priceMax: string
  onCuisineChange: (v: Cuisine | '全部') => void
  onMealTimeChange: (v: MealTime | '全部') => void
  onDifficultyChange: (v: Difficulty | '全部') => void
  onCategoryChange: (v: Category | '全部') => void
  onPriceMinChange: (v: string) => void
  onPriceMaxChange: (v: string) => void
  onReset: () => void
}

const CUISINES: (Cuisine | '全部')[] = ['全部', '川菜', '粤菜', '湘菜', '鲁菜', '苏菜', '面食', '西餐', '日料', '韩餐', '烧烤', '火锅', '小吃', '家常菜', '其他']
const MEAL_TIMES: { value: MealTime | '全部'; label: string }[] = [
  { value: '全部', label: '全部' },
  { value: 'breakfast', label: '早餐' },
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
  { value: 'snack', label: '加餐' },
]
const DIFFICULTIES: { value: Difficulty | '全部'; label: string }[] = [
  { value: '全部', label: '全部' },
  { value: 'lazy', label: '懒人速做' },
  { value: 'cook', label: '下厨正餐' },
  { value: 'takeout', label: '外卖' },
]
const CATEGORIES: { value: Category | '全部'; label: string }[] = [
  { value: '全部', label: '全部' },
  { value: 'favorite', label: '收藏常备' },
  { value: 'temp', label: '临时备选' },
  { value: 'takeout', label: '外卖专属' },
]

export default function FilterPanel({
  onClose, cuisine, mealTime, difficulty, category, priceMin, priceMax,
  onCuisineChange, onMealTimeChange, onDifficultyChange, onCategoryChange,
  onPriceMinChange, onPriceMaxChange, onReset,
}: FilterPanelProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-2xl w-full max-w-lg px-5 pt-5 pb-8 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#333] text-lg">高级筛选</h3>
          <button onClick={onClose} className="text-[#999]"><X size={22} /></button>
        </div>

        {/* 菜系 */}
        <div className="mb-4">
          <label className="text-xs font-medium text-[#999] mb-2 block">菜系</label>
          <div className="flex flex-wrap gap-1.5">
            {CUISINES.map(c => (
              <button key={c} onClick={() => onCuisineChange(c)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  cuisine === c ? 'bg-[#7DB892] text-white' : 'bg-gray-100 text-[#666]'
                }`}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* 用餐时段 */}
        <div className="mb-4">
          <label className="text-xs font-medium text-[#999] mb-2 block">用餐时段</label>
          <div className="flex gap-2">
            {MEAL_TIMES.map(m => (
              <button key={m.value} onClick={() => onMealTimeChange(m.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  mealTime === m.value ? 'bg-[#7DB892] text-white' : 'bg-gray-100 text-[#666]'
                }`}
              >{m.label}</button>
            ))}
          </div>
        </div>

        {/* 制作难度 */}
        <div className="mb-4">
          <label className="text-xs font-medium text-[#999] mb-2 block">制作方式</label>
          <div className="flex gap-2">
            {DIFFICULTIES.map(d => (
              <button key={d.value} onClick={() => onDifficultyChange(d.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  difficulty === d.value ? 'bg-[#7DB892] text-white' : 'bg-gray-100 text-[#666]'
                }`}
              >{d.label}</button>
            ))}
          </div>
        </div>

        {/* 存储分区 */}
        <div className="mb-4">
          <label className="text-xs font-medium text-[#999] mb-2 block">存储分区</label>
          <div className="flex gap-2">
            {CATEGORIES.map(c => (
              <button key={c.value} onClick={() => onCategoryChange(c.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  category === c.value ? 'bg-[#7DB892] text-white' : 'bg-gray-100 text-[#666]'
                }`}
              >{c.label}</button>
            ))}
          </div>
        </div>

        {/* 价格区间 */}
        <div className="mb-5">
          <label className="text-xs font-medium text-[#999] mb-2 block">价格区间（元）</label>
          <div className="flex items-center gap-2">
            <input type="number" value={priceMin} onChange={e => onPriceMinChange(e.target.value)}
              placeholder="最低价" className="flex-1 px-3 py-2 rounded-lg border border-[#E8E8E0] text-sm outline-none focus:border-[#7DB892]" />
            <span className="text-[#ccc]">—</span>
            <input type="number" value={priceMax} onChange={e => onPriceMaxChange(e.target.value)}
              placeholder="最高价" className="flex-1 px-3 py-2 rounded-lg border border-[#E8E8E0] text-sm outline-none focus:border-[#7DB892]" />
          </div>
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          <button onClick={onReset} className="flex-1 py-3 rounded-xl border border-[#E8E8E0] text-sm text-[#999]">
            重置筛选
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-[#7DB892] text-white text-sm font-medium">
            确定
          </button>
        </div>
      </div>
    </div>
  )
}
