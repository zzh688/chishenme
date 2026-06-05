import { useState, useCallback } from 'react'
import TopBar from '../components/layout/TopBar'
import PageContainer from '../components/layout/PageContainer'
import DishList from '../components/dish/DishList'
import DishForm from '../components/dish/DishForm'
import DishDetail from '../components/dish/DishDetail'
import OcrImport from '../components/settings/OcrImport'
import { useDishes } from '../hooks/useDishes'
import type { Dish, MealTime } from '../types'
import { useMealHistory } from '../hooks/useMealHistory'
import { Plus, Upload } from 'lucide-react'

export default function TakeoutPage() {
  const { dishes, loading, addDish, updateDish, removeDish, togglePin, moveDish } = useDishes('takeout')
  const { recordMeal } = useMealHistory()

  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState<Dish | null>(null)
  const [showOcr, setShowOcr] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | undefined>()

  const handleSave = useCallback(async (dishData: Omit<Dish, 'id' | 'createdAt' | 'sortOrder'>, imageFile?: File) => {
    const data = { ...dishData, category: 'takeout' as const, difficulty: 'takeout' as const }
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
        category: 'takeout',
        expireDays: null,
        isPinned: false,
      })
    }
  }, [addDish])

  return (
    <>
      <TopBar title="外卖专属" showActions={false} />
      <PageContainer>
        <DishList
          dishes={dishes}
          loading={loading}
          onTogglePin={togglePin}
          onMove={moveDish}
          onDishClick={d => setShowDetail(d)}
          onRecordMeal={handleRecordMeal}
          showRecordButton
          emptyText="还没有外卖菜品，拍照导入或手动添加"
        />
      </PageContainer>

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
      {showOcr && (
        <OcrImport
          onImport={handleOcrImport}
          onClose={() => setShowOcr(false)}
        />
      )}
    </>
  )
}
