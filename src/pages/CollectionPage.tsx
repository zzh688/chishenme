import { useState, useCallback } from 'react'
import TopBar from '../components/layout/TopBar'
import PageContainer from '../components/layout/PageContainer'
import DishList from '../components/dish/DishList'
import DishForm from '../components/dish/DishForm'
import DishDetail from '../components/dish/DishDetail'
import { useDishes } from '../hooks/useDishes'
import type { Dish, MealTime } from '../types'
import { useMealHistory } from '../hooks/useMealHistory'
import { Plus } from 'lucide-react'

export default function CollectionPage() {
  const { dishes, loading, addDish, updateDish, removeDish, togglePin, moveDish } = useDishes('favorite')
  const { recordMeal } = useMealHistory()

  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState<Dish | null>(null)
  const [editingDish, setEditingDish] = useState<Dish | undefined>()

  const handleSave = useCallback(async (dishData: Omit<Dish, 'id' | 'createdAt' | 'sortOrder'>, imageFile?: File) => {
    const data = { ...dishData, category: 'favorite' as const }
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

  return (
    <>
      <TopBar title="收藏常备菜" showActions={false} />
      <PageContainer>
        <DishList
          dishes={dishes}
          loading={loading}
          onTogglePin={togglePin}
          onMove={moveDish}
          onDishClick={d => setShowDetail(d)}
          onRecordMeal={handleRecordMeal}
          showRecordButton
          emptyText="收藏常备菜是空的，去首页添加吧"
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
