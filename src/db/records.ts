import { db } from './index'
import type { MealRecord, MealTime } from '../types'

// 添加用餐记录
export async function addMealRecord(record: Omit<MealRecord, 'id' | 'createdAt'>): Promise<number> {
  return db.mealRecords.add({
    ...record,
    createdAt: new Date(),
  } as MealRecord)
}

// 获取近N天用餐记录
export async function getRecentRecords(days: number = 7): Promise<MealRecord[]> {
  const now = new Date()
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  const startStr = startDate.toISOString().split('T')[0]

  return db.mealRecords
    .where('date')
    .aboveOrEqual(startStr)
    .reverse()
    .sortBy('date')
}

// 获取近N天吃过的菜品ID集合
export async function getRecentDishIds(days: number = 7): Promise<Set<number>> {
  const records = await getRecentRecords(days)
  return new Set(records.map(r => r.dishId))
}

// 获取指定日期的用餐记录
export async function getRecordsByDate(date: string): Promise<MealRecord[]> {
  return db.mealRecords.where('date').equals(date).toArray()
}

// 获取当日已点餐的时段
export async function getTodayMealTimes(): Promise<MealTime[]> {
  const today = new Date().toISOString().split('T')[0]
  const records = await getRecordsByDate(today)
  return records.map(r => r.mealTime)
}

// 检查某菜品在近N天内是否吃过
export async function hasEatenRecently(dishId: number, days: number = 7): Promise<boolean> {
  const recentIds = await getRecentDishIds(days)
  return recentIds.has(dishId)
}

// 删除用餐记录
export async function deleteMealRecord(id: number): Promise<void> {
  await db.mealRecords.delete(id)
}
