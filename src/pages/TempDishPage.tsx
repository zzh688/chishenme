import { useState, useCallback, useEffect } from 'react'
import TopBar from '../components/layout/TopBar'
import PageContainer from '../components/layout/PageContainer'
import DishList from '../components/dish/DishList'
import DishForm from '../components/dish/DishForm'
import DishDetail from '../components/dish/DishDetail'
import { useDishes } from '../hooks/useDishes'
import { cleanExpiredDishes } from '../db/dishes'
import type { Dish, MealTime } from '../types'
import { useMealHistory } from '../hooks/useMealHistory'
import { Plus, Trash2 } from 'lucide-react'

export default function TempDishPage() {
  const { dishes, loading, addDish, updateDish, removeDish, togglePin, moveDish, loadDishes } = useDishes('temp')
  const { recordMeal } = useMealHistory()

  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState<Dish | null>(null)
  const [editingDish, setEditingDish] = useState<Dish | undefined>()

  // 启动时清理过期
  useEffect(() => {
    cleanExpiredDishes().then(n => {
      if (n > 0) loadDishes()
    })
  }, [loadDishes])

  const handleSave = useCallback(async (dishData: Omit<Dish, 'id' | 'createdAt' | 'sortOrder'>, imageFile?: File) => {
    const data = { ...dishData, category: 'temp' as const }
    if (editingDish?.id != null) {
      await updateDish(editingDish.id, data, imageFile)
    } else {
      await addDish(data, imageFile)
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
    const mealTime = prompt('选择用餐时段：breakfast(早)/lunch(午)/dinner(晚)/snack(加餐)', 'lunch')
    if (mealTime && ['breakfast', 'lunch', 'dinner', 'snack'].includes(mealTime)) {
      await recordMeal(dish.id, dish.name, mealTime as MealTime)
    }
  }, [recordMeal])

  const handleCleanNow = async () => {
    const n = await cleanExpiredDishes()
    if (n > 0) {
      await loadDishes()
      alert(`已清理 ${n} 个过期菜品`)
    } else {
      alert('没有需要清理的过期菜品')
    }
  }

  return (
    <>
      <TopBar title="临时备选菜" showActions={false} />
      <PageContainer>
        {/* 过期提示 */}
        <div className="flex items-center justify-between mb-3 px-3 py-2 rounded-lg bg-[#FFF8E1] text-xs text-[#B8952E]">
          <span>临时菜品到期自动清理</span>
          <button onClick={handleCleanNow} className="flex items-center gap-1 text-[#E0746A] font-medium">
            <Trash2 size={12} />
            立即清理
          </button>
        </div>

        <DishList
          dishes={dishes}
          loading={loading}
          onTogglePin={togglePin}
          onMove={moveDish}
          onDishClick={d => setShowDetail(d)}
          onRecordMeal={handleRecordMeal}
          showRecordButton
          emptyText="临时备选菜是空的，去首页添加吧"
        />
      </PageContainer>

      <div className="fixed bottom-20 right-4 z-30">
        <button
          onClick={() => { setEditingDish(undefined); setShowForm(true) }}
          className="w-12 h-12 rounded-full bg-[#7DB892] shadow-lg flex items-center justify-center text-white active:scale-90 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

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
    </>
  )
}
