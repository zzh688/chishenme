import { db } from './index'
import type { BlacklistItem } from '../types'

// 获取所有黑名单
export async function getBlacklist(): Promise<BlacklistItem[]> {
  return db.blacklist.toArray()
}

// 添加黑名单项
export async function addBlacklistItem(item: Omit<BlacklistItem, 'id'>): Promise<number> {
  return db.blacklist.add(item as BlacklistItem)
}

// 删除黑名单项
export async function removeBlacklistItem(id: number): Promise<void> {
  await db.blacklist.delete(id)
}

// 检查菜品是否被黑名单屏蔽
export async function isBlockedByBlacklist(dishName: string, ingredients: string[]): Promise<boolean> {
  const items = await getBlacklist()
  const blocked = items.some(item =>
    dishName.includes(item.keyword) ||
    ingredients.some(i => i.includes(item.keyword))
  )
  return blocked
}

// 从菜品列表中过滤掉被屏蔽的
export async function filterBlockedDishes<T extends { name: string; ingredients: string[] }>(
  dishes: T[]
): Promise<T[]> {
  const blacklist = await getBlacklist()
  const keywords = blacklist.map(b => b.keyword)
  if (keywords.length === 0) return dishes
  return dishes.filter(d =>
    !keywords.some(k =>
      d.name.includes(k) || d.ingredients.some(i => i.includes(k))
    )
  )
}
