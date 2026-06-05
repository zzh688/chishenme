// 菜系类型
export type Cuisine =
  | '川菜' | '粤菜' | '湘菜' | '鲁菜' | '苏菜'
  | '闽菜' | '浙菜' | '徽菜' | '面食' | '西餐'
  | '日料' | '韩餐' | '烧烤' | '火锅' | '小吃'
  | '家常菜' | '其他'

// 用餐时段
export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack'

// 制作难度
export type Difficulty = 'lazy' | 'cook' | 'takeout'

// 存储分区
export type Category = 'favorite' | 'temp' | 'takeout'

// 黑名单类型
export type BlacklistType = 'ingredient' | 'dish'

// 预设标签
export const PRESET_TAGS = [
  '少油', '减脂', '快手', '重辣',
  '微辣', '清淡', '高蛋白', '素食',
  '面食', '米饭', '汤类', '凉拌',
  '油炸', '蒸制', '炖煮', '烘焙',
] as const
export type PresetTag = typeof PRESET_TAGS[number]

// 菜品
export interface Dish {
  id?: number
  name: string
  image?: Blob | null
  imageDataUrl?: string | null  // 用于展示的 data URL
  ingredients: string[]
  cuisine: Cuisine
  mealTime: MealTime[]
  price: number
  difficulty: Difficulty
  tags: string[]
  category: Category
  expireDays: number | null  // null = 永久
  isPinned: boolean
  sortOrder: number
  createdAt: Date
}

// 用餐记录
export interface MealRecord {
  id?: number
  dishId: number
  dishName?: string  // 冗余字段，方便展示
  mealTime: MealTime
  date: string  // YYYY-MM-DD
  createdAt: Date
}

// 黑名单
export interface BlacklistItem {
  id?: number
  keyword: string
  type: BlacklistType
}

// 用户设置
export interface AppSettings {
  defaultExpireDays: number | null
  autoCleanEnabled: boolean
}

// 筛选条件
export interface FilterOptions {
  keyword?: string
  cuisine?: Cuisine | '全部'
  mealTime?: MealTime | '全部'
  priceMin?: number
  priceMax?: number
  difficulty?: Difficulty | '全部'
  tags: string[]
  category?: Category | '全部'
}

// 随机配餐结果
export interface MealPlan {
  breakfast: Dish | null
  lunch: Dish | null
  dinner: Dish | null
  snack?: Dish | null
}
