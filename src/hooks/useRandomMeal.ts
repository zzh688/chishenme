import { useState, useCallback } from 'react'
import type { Dish, MealPlan, MealTime } from '../types'
import { filterBlockedDishes } from '../db/blacklist'
import { getRecentDishIds } from '../db/records'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function useRandomMeal(allDishes: Dish[]) {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [loading, setLoading] = useState(false)

  const generateMeal = useCallback(async (
    mealTimes: MealTime[] = ['breakfast', 'lunch', 'dinner'],
    preferCategories: ('favorite' | 'temp' | 'takeout')[] = ['favorite', 'temp', 'takeout']
  ) => {
    setLoading(true)
    try {
      // 过滤黑名单
      const safe = await filterBlockedDishes(allDishes)
      // 获取近7天记录
      const recentIds = await getRecentDishIds(7)

      const plan: MealPlan = { breakfast: null, lunch: null, dinner: null }

      for (const mt of mealTimes) {
        // 按优先级从各分区选菜
        let candidates: Dish[] = []

        for (const cat of preferCategories) {
          const catDishes = safe.filter(d =>
            d.category === cat &&
            d.mealTime.includes(mt) &&
            !recentIds.has(d.id!)
          )
          // 随机打乱
          candidates = shuffle(catDishes)
          if (candidates.length > 0) break
        }

        // 如果所有分区都没有，放宽近7天限制
        if (candidates.length === 0) {
          for (const cat of preferCategories) {
            const catDishes = safe.filter(d =>
              d.category === cat &&
              d.mealTime.includes(mt)
            )
            candidates = shuffle(catDishes)
            if (candidates.length > 0) break
          }
        }

        if (candidates.length > 0) {
          plan[mt] = candidates[0]
          // 避免同一餐推荐重复
          recentIds.add(candidates[0].id!)
        }
      }

      setMealPlan(plan)
      return plan
    } finally {
      setLoading(false)
    }
  }, [allDishes])

  const clearPlan = useCallback(() => {
    setMealPlan(null)
  }, [])

  return { mealPlan, loading, generateMeal, clearPlan }
}
