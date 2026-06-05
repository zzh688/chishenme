import { useState, useRef } from 'react'
import { X, Camera, ImageUp } from 'lucide-react'
import type { Dish, Category, Cuisine, Difficulty, MealTime } from '../../types'
import { PRESET_TAGS } from '../../types'
import { compressImage } from '../../utils/storage'

interface DishFormProps {
  initial?: Partial<Dish>
  onSave: (dish: Omit<Dish, 'id' | 'createdAt' | 'sortOrder'>, imageFile?: File) => void
  onClose: () => void
}

const CUISINES: Cuisine[] = ['川菜', '粤菜', '湘菜', '鲁菜', '苏菜', '闽菜', '浙菜', '徽菜', '面食', '西餐', '日料', '韩餐', '烧烤', '火锅', '小吃', '家常菜', '其他']
const MEAL_TIMES: { value: MealTime; label: string }[] = [
  { value: 'breakfast', label: '早餐' },
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
  { value: 'snack', label: '加餐' },
]
const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'lazy', label: '懒人速做' },
  { value: 'cook', label: '下厨正餐' },
  { value: 'takeout', label: '外卖' },
]
const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'favorite', label: '收藏常备菜' },
  { value: 'temp', label: '临时备选菜' },
  { value: 'takeout', label: '外卖专属' },
]
const EXPIRE_OPTIONS = [
  { value: null as unknown as number, label: '永久保存' },
  { value: 7, label: '7天' },
  { value: 15, label: '15天' },
  { value: 30, label: '30天' },
]

export default function DishForm({ initial, onSave, onClose }: DishFormProps) {
  const [name, setName] = useState(initial?.name || '')
  const [ingredientsStr, setIngredientsStr] = useState(initial?.ingredients?.join('、') || '')
  const [cuisine, setCuisine] = useState<Cuisine>(initial?.cuisine || '家常菜')
  const [mealTime, setMealTime] = useState<MealTime[]>(initial?.mealTime || ['lunch'])
  const [price, setPrice] = useState(initial?.price?.toString() || '')
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty || 'cook')
  const [tags, setTags] = useState<string[]>(initial?.tags || [])
  const [category, setCategory] = useState<Category>(initial?.category || 'favorite')
  const [expireDays, setExpireDays] = useState<number | null>(initial?.expireDays ?? null)
  const [imagePreview, setImagePreview] = useState<string | null>(initial?.imageDataUrl || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const compressed = await compressImage(file)
      const compressedFile = new File([compressed], file.name, { type: compressed.type })
      setImageFile(compressedFile)
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(compressedFile)
    } catch {
      // 压缩失败就用原图
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const toggleMealTime = (mt: MealTime) => {
    setMealTime(prev => prev.includes(mt) ? prev.filter(t => t !== mt) : [...prev, mt])
  }

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    const ingredients = ingredientsStr.split(/[、,，\s]+/).filter(Boolean)
    const dish: Omit<Dish, 'id' | 'createdAt' | 'sortOrder'> = {
      name: name.trim(),
      ingredients,
      cuisine,
      mealTime,
      price: parseFloat(price) || 0,
      difficulty,
      tags,
      category,
      expireDays: category === 'temp' ? expireDays : null,
      isPinned: initial?.isPinned || false,
      imageDataUrl: imagePreview,
    }
    onSave(dish, imageFile || undefined)
  }

  const isValid = name.trim().length > 0 && mealTime.length > 0

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E8E0] shrink-0">
        <button onClick={onClose} className="text-[#999]">
          <X size={24} />
        </button>
        <h2 className="font-semibold text-[#333]">{initial?.name ? '编辑菜品' : '添加菜品'}</h2>
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            isValid
              ? 'bg-[#7DB892] text-white active:scale-95'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          保存
        </button>
      </div>

      {/* 表单内容 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* 图片上传 */}
        <div>
          <label className="text-sm font-medium text-[#666] mb-2 block">菜品图片</label>
          <div className="flex gap-3">
            {imagePreview && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <img src={imagePreview} alt="预览" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setImagePreview(null); setImageFile(null) }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-lg border-2 border-dashed border-[#ddd] flex flex-col items-center justify-center gap-1 text-[#999] hover:border-[#7DB892] hover:text-[#7DB892] transition-colors"
            >
              <ImageUp size={20} />
              <span className="text-xs">相册</span>
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-24 h-24 rounded-lg border-2 border-dashed border-[#ddd] flex flex-col items-center justify-center gap-1 text-[#999] hover:border-[#7DB892] hover:text-[#7DB892] transition-colors"
            >
              <Camera size={20} />
              <span className="text-xs">拍照</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
          </div>
        </div>

        {/* 菜品名称 */}
        <div>
          <label className="text-sm font-medium text-[#666] mb-1 block">菜品名称 *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="如：宫保鸡丁"
            className="w-full px-3 py-2.5 rounded-lg border border-[#E8E8E0] text-sm focus:outline-none focus:border-[#7DB892] focus:ring-1 focus:ring-[#7DB892]"
          />
        </div>

        {/* 食材清单 */}
        <div>
          <label className="text-sm font-medium text-[#666] mb-1 block">食材清单（用顿号或逗号分隔）</label>
          <input
            value={ingredientsStr}
            onChange={e => setIngredientsStr(e.target.value)}
            placeholder="如：鸡肉、花生、干辣椒"
            className="w-full px-3 py-2.5 rounded-lg border border-[#E8E8E0] text-sm focus:outline-none focus:border-[#7DB892] focus:ring-1 focus:ring-[#7DB892]"
          />
        </div>

        {/* 用餐时段 */}
        <div>
          <label className="text-sm font-medium text-[#666] mb-2 block">用餐时段 *</label>
          <div className="flex gap-2">
            {MEAL_TIMES.map(mt => (
              <button
                key={mt.value}
                onClick={() => toggleMealTime(mt.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  mealTime.includes(mt.value)
                    ? 'bg-[#7DB892] text-white'
                    : 'bg-gray-100 text-[#666]'
                }`}
              >
                {mt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 菜系 */}
        <div>
          <label className="text-sm font-medium text-[#666] mb-2 block">菜系</label>
          <div className="flex flex-wrap gap-1.5">
            {CUISINES.map(c => (
              <button
                key={c}
                onClick={() => setCuisine(c)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  cuisine === c
                    ? 'bg-[#7DB892] text-white'
                    : 'bg-gray-100 text-[#666]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 价格 */}
        <div>
          <label className="text-sm font-medium text-[#666] mb-1 block">参考价格（元）</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="如：25"
            className="w-full px-3 py-2.5 rounded-lg border border-[#E8E8E0] text-sm focus:outline-none focus:border-[#7DB892] focus:ring-1 focus:ring-[#7DB892]"
          />
        </div>

        {/* 制作难度 */}
        <div>
          <label className="text-sm font-medium text-[#666] mb-2 block">制作方式</label>
          <div className="flex gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  difficulty === d.value
                    ? 'bg-[#7DB892] text-white'
                    : 'bg-gray-100 text-[#666]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 标签 */}
        <div>
          <label className="text-sm font-medium text-[#666] mb-2 block">标签（可多选）</label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  tags.includes(tag)
                    ? 'bg-[#7DB892] text-white'
                    : 'bg-gray-100 text-[#666]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 存储分区 */}
        <div>
          <label className="text-sm font-medium text-[#666] mb-2 block">存储分区</label>
          <div className="flex gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  category === c.value
                    ? 'bg-[#7DB892] text-white'
                    : 'bg-gray-100 text-[#666]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 过期时间（仅临时备选） */}
        {category === 'temp' && (
          <div>
            <label className="text-sm font-medium text-[#666] mb-2 block">保存周期</label>
            <div className="flex gap-2">
              {EXPIRE_OPTIONS.map(o => (
                <button
                  key={o.label}
                  onClick={() => setExpireDays(o.value)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    expireDays === o.value
                      ? 'bg-[#7DB892] text-white'
                      : 'bg-gray-100 text-[#666]'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
