import { db } from './index'
import type { Dish, Category } from '../types'

// 新增菜品
export async function addDish(dish: Omit<Dish, 'id' | 'createdAt' | 'sortOrder'>): Promise<number> {
  const now = new Date()
  const count = await db.dishes.count()
  return db.dishes.add({
    ...dish,
    createdAt: now,
    sortOrder: count,
  } as Dish)
}

// 更新菜品
export async function updateDish(id: number, changes: Partial<Dish>): Promise<number> {
  return db.dishes.update(id, changes)
}

// 删除菜品
export async function deleteDish(id: number): Promise<void> {
  await db.dishes.delete(id)
}

// 获取所有菜品（按分区）
export async function getDishesByCategory(category: Category): Promise<Dish[]> {
  return db.dishes
    .where('category')
    .equals(category)
    .reverse()
    .sortBy('createdAt')
}

// 获取单个菜品
export async function getDishById(id: number): Promise<Dish | undefined> {
  return db.dishes.get(id)
}

// 搜索菜品（关键词匹配名称或食材）
export async function searchDishes(keyword: string): Promise<Dish[]> {
  const k = keyword.toLowerCase()
  const all = await db.dishes.toArray()
  return all.filter(d =>
    d.name.toLowerCase().includes(k) ||
    d.ingredients.some(i => i.toLowerCase().includes(k))
  )
}

// 置顶/取消置顶
export async function togglePin(id: number, pinned: boolean): Promise<void> {
  await db.dishes.update(id, { isPinned: pinned })
}

// 更新排序
export async function updateSortOrder(id: number, order: number): Promise<void> {
  await db.dishes.update(id, { sortOrder: order })
}

// 清理过期菜品
export async function cleanExpiredDishes(): Promise<number> {
  const now = new Date()
  const tempDishes = await db.dishes.where('category').equals('temp').toArray()

  let cleaned = 0
  for (const dish of tempDishes) {
    if (dish.expireDays != null && dish.id != null) {
      const createdAt = new Date(dish.createdAt)
      const expireDate = new Date(createdAt.getTime() + dish.expireDays * 24 * 60 * 60 * 1000)
      if (now > expireDate) {
        await db.dishes.delete(dish.id)
        cleaned++
      }
    }
  }
  return cleaned
}

// 获取所有菜品（用于随机配餐等）
export async function getAllDishes(): Promise<Dish[]> {
  return db.dishes.toArray()
}

// 按菜系筛选
export async function getDishesByCuisine(cuisine: string): Promise<Dish[]> {
  return db.dishes.where('cuisine').equals(cuisine).toArray()
}

// 按价格区间筛选
export async function getDishesByPriceRange(min: number, max: number): Promise<Dish[]> {
  return db.dishes.where('price').between(min, max, true, true).toArray()
}

// 批量导入菜品
export async function bulkAddDishes(dishes: Omit<Dish, 'id' | 'createdAt' | 'sortOrder'>[]): Promise<number[]> {
  const now = new Date()
  const count = await db.dishes.count()
  const items = dishes.map((d, i) => ({
    ...d,
    createdAt: now,
    sortOrder: count + i,
  } as Dish))
  return db.dishes.bulkAdd(items, { allKeys: true }) as Promise<number[]>
}
