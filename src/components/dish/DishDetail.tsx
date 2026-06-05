import { X, Pencil, Trash2 } from 'lucide-react'
import type { Dish } from '../../types'
import { formatPrice, mealTimeLabels, difficultyLabels, difficultyColors } from '../../utils/storage'

interface DishDetailProps {
  dish: Dish
  onEdit: (dish: Dish) => void
  onDelete: (id: number) => void
  onClose: () => void
}

export default function DishDetail({ dish, onEdit, onDelete, onClose }: DishDetailProps) {
  const handleDelete = () => {
    if (dish.id != null && confirm(`确定删除「${dish.name}」吗？此操作不可恢复。`)) {
      onDelete(dish.id)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* 顶栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E8E0] shrink-0">
        <button onClick={onClose} className="text-[#999]">
          <X size={24} />
        </button>
        <h2 className="font-semibold text-[#333]">菜品详情</h2>
        <div className="flex gap-2">
          <button onClick={() => onEdit(dish)} className="w-9 h-9 rounded-full flex items-center justify-center text-[#7DB892] hover:bg-[#E8F5EC]">
            <Pencil size={18} />
          </button>
          <button onClick={handleDelete} className="w-9 h-9 rounded-full flex items-center justify-center text-[#E0746A] hover:bg-red-50">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto">
        {/* 大图 */}
        {dish.imageDataUrl ? (
          <div className="w-full aspect-square bg-gray-100">
            <img src={dish.imageDataUrl} alt={dish.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full aspect-square bg-gradient-to-br from-[#E8F5EC] to-[#F0F0EB] flex items-center justify-center">
            <span className="text-6xl">🍽️</span>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* 名称和价格 */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#333]">{dish.name}</h1>
            <span className="text-xl font-bold text-[#7DB892]">{formatPrice(dish.price)}</span>
          </div>

          {/* 属性标签 */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-sm px-2.5 py-1 rounded-full ${difficultyColors[dish.difficulty]}`}>
              {difficultyLabels[dish.difficulty]}
            </span>
            <span className="text-sm px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {dish.cuisine}
            </span>
            {dish.mealTime.map(mt => (
              <span key={mt} className="text-sm px-2.5 py-1 rounded-full bg-[#E8F5EC] text-[#5A9A6E]">
                {mealTimeLabels[mt]}
              </span>
            ))}
          </div>

          {/* 自定义标签 */}
          {dish.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {dish.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full border border-[#7DB892] text-[#7DB892]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 食材清单 */}
          {dish.ingredients.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[#999] mb-1.5">食材清单</h3>
              <div className="flex flex-wrap gap-1.5">
                {dish.ingredients.map((ing, i) => (
                  <span key={i} className="text-sm px-2.5 py-1 rounded-full bg-[#F5F5F0] text-[#666]">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 存储信息 */}
          <div className="p-3 rounded-lg bg-[#FAFAF5] text-xs text-[#999] space-y-1">
            <p>存储分区：{dish.category === 'favorite' ? '收藏常备菜' : dish.category === 'temp' ? '临时备选菜' : '外卖专属'}</p>
            {dish.category === 'temp' && dish.expireDays && (
              <p>保存周期：{dish.expireDays}天后自动清理</p>
            )}
            <p>录入时间：{new Date(dish.createdAt).toLocaleDateString('zh-CN')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
