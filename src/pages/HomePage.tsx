import { useState, useCallback } from 'react'
import TopBar from '../components/layout/TopBar'
import PageContainer from '../components/layout/PageContainer'
import DishList from '../components/dish/DishList'
import DishForm from '../components/dish/DishForm'
import DishDetail from '../components/dish/DishDetail'
import RandomPicker from '../components/meal/RandomPicker'
import MealPlanCard from '../components/meal/MealPlanCard'
import SearchBar from '../components/search/SearchBar'
import TagFilter from '../components/search/TagFilter'
import FilterPanel from '../components/search/FilterPanel'
import OcrImport from '../components/settings/OcrImport'
import { useDishes } from '../hooks/useDishes'
import { useSearch } from '../hooks/useSearch'
import { useRandomMeal } from '../hooks/useRandomMeal'
import { useMealHistory } from '../hooks/useMealHistory'
import type { Dish, MealTime, Category } from '../types'
import { Plus, Upload } from 'lucide-react'

export default function HomePage() {
  const { dishes, loading, addDish, updateDish, removeDish, togglePin, moveDish } = useDishes()
  const { filters, results, updateFilter, toggleTag, clearFilters } = useSearch(dishes)
  const { mealPlan, loading: randomLoading, generateMeal, clearPlan } = useRandomMeal(dishes)
  const { todayMealTimes, recordMeal } = useMealHistory()

  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState<Dish | null>(null)
  const [showRandom, setShowRandom] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showOcr, setShowOcr] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | undefined>()

  const handleSave = useCallback(async (dishData: Omit<Dish, 'id' | 'createdAt' | 'sortOrder'>, imageFile?: File) => {
    if (editingDish?.id != null) {
      await updateDish(editingDish.id, dishData, imageFile)
    } else {
      await addDish(dishData, imageFile)
    }
    setShowForm(false)
    setEditingDish(undefined)
  }, [editingDish, addDish, updateDish])

  const handleEdit = useCallback((dish: Dish) => {
    setShowDetail(null)
    setEditingDish(dish)
    setShowForm(true)
  }, [])

  const handleRecordMeal = useCallback(async (dish: Dish) => {
    if (!dish.id) return
    // 简单交互：弹出选择时段
    const mealTime = prompt('选择用餐时段：breakfast(早)/lunch(午)/dinner(晚)/snack(加餐)', 'lunch')
    if (mealTime && ['breakfast', 'lunch', 'dinner', 'snack'].includes(mealTime)) {
      await recordMeal(dish.id, dish.name, mealTime as MealTime)
    }
  }, [recordMeal])

  const handleSelectMeal = useCallback(async (dish: Dish, mealTime: MealTime) => {
    if (dish.id) {
      await recordMeal(dish.id, dish.name, mealTime)
    }
  }, [recordMeal])

  const handleOcrImport = useCallback(async (items: Array<{ name: string; price: number }>) => {
    for (const item of items) {
      await addDish({
        name: item.name,
        price: item.price,
        ingredients: [],
        cuisine: '家常菜',
        mealTime: ['lunch', 'dinner'],
        difficulty: 'takeout',
        tags: [],
        category: 'temp',
        expireDays: 7,
        isPinned: false,
      })
    }
  }, [addDish])

  const activeFilters = filters.keyword || filters.tags.length > 0 ||
    (filters.cuisine && filters.cuisine !== '全部') ||
    (filters.mealTime && filters.mealTime !== '全部') ||
    (filters.difficulty && filters.difficulty !== '全部')

  return (
    <>
      <TopBar
        title="吃什么"
        onSearchClick={() => setShowFilter(true)}
        onRandomClick={() => setShowRandom(true)}
      />

      {/* 搜索区 */}
      <div className="px-4 pt-3 pb-2 space-y-2 shrink-0 bg-[#FAFAF5]">
        <SearchBar
          value={filters.keyword || ''}
          onChange={v => updateFilter('keyword', v)}
        />
        <TagFilter selectedTags={filters.tags} onToggle={toggleTag} />
        {activeFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-[#7DB892] font-medium"
          >
            清除所有筛选
          </button>
        )}
      </div>

      <PageContainer>
        {/* 今日配餐 */}
        {mealPlan && (
          <div className="mb-4">
            <MealPlanCard
              plan={mealPlan}
              loading={randomLoading}
              onRegenerate={(mts) => generateMeal(mts)}
              onSelectDish={handleSelectMeal}
              todayMealTimes={todayMealTimes}
            />
            <button
              onClick={clearPlan}
              className="text-xs text-[#999] mt-2 ml-1"
            >
              收起推荐
            </button>
          </div>
        )}

        {!mealPlan && (
          <button
            onClick={() => setShowRandom(true)}
            className="w-full mb-4 py-3 rounded-xl border-2 border-dashed border-[#ddd] text-[#999] text-sm hover:border-[#7DB892] hover:text-[#7DB892] transition-colors"
          >
            🎲 点我随机配餐
          </button>
        )}

        {/* 菜品列表 */}
        <DishList
          dishes={activeFilters ? results : dishes}
          loading={loading}
          onTogglePin={togglePin}
          onMove={moveDish}
          onDishClick={d => setShowDetail(d)}
          onRecordMeal={handleRecordMeal}
          showRecordButton
          emptyText="还没有菜品，点右下角 + 添加吧"
        />
      </PageContainer>

      {/* FAB 添加按钮 */}
      <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={() => setShowOcr(true)}
          className="w-12 h-12 rounded-full bg-white border border-[#E8E8E0] shadow-lg flex items-center justify-center text-[#7DB892] active:scale-90 transition-all"
        >
          <Upload size={20} />
        </button>
        <button
          onClick={() => { setEditingDish(undefined); setShowForm(true) }}
          className="w-12 h-12 rounded-full bg-[#7DB892] shadow-lg flex items-center justify-center text-white active:scale-90 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* 弹窗 */}
      {showForm && (
        <DishForm
          initial={editingDish}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingDish(undefined) }}
        />
      )}
      {showDetail && (
        <DishDetail
          dish={showDetail}
          onEdit={handleEdit}
          onDelete={removeDish}
          onClose={() => setShowDetail(null)}
        />
      )}
      {showRandom && (
        <RandomPicker
          onGenerate={(mts) => generateMeal(mts)}
          onClose={() => setShowRandom(false)}
        />
      )}
      {showFilter && (
        <FilterPanel
          onClose={() => setShowFilter(false)}
          cuisine={filters.cuisine || '全部'}
          mealTime={filters.mealTime || '全部'}
          difficulty={filters.difficulty || '全部'}
          category={filters.category || '全部'}
          priceMin={filters.priceMin?.toString() || ''}
          priceMax={filters.priceMax?.toString() || ''}
          onCuisineChange={v => updateFilter('cuisine', v)}
          onMealTimeChange={v => updateFilter('mealTime', v)}
          onDifficultyChange={v => updateFilter('difficulty', v)}
          onCategoryChange={v => updateFilter('category', v)}
          onPriceMinChange={v => updateFilter('priceMin', v ? parseFloat(v) : undefined)}
          onPriceMaxChange={v => updateFilter('priceMax', v ? parseFloat(v) : undefined)}
          onReset={clearFilters}
        />
      )}
      {showOcr && (
        <OcrImport
          onImport={handleOcrImport}
          onClose={() => setShowOcr(false)}
        />
      )}
    </>
  )
}
