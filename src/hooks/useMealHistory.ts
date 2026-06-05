import { useState, useEffect, useCallback } from 'react'
import type { MealRecord, MealTime } from '../types'
import * as recordDB from '../db/records'
import { getToday } from '../utils/storage'

export function useMealHistory() {
  const [records, setRecords] = useState<MealRecord[]>([])
  const [todayRecords, setTodayRecords] = useState<MealRecord[]>([])
  const [loading, setLoading] = useState(true)

  const loadRecords = useCallback(async () => {
    setLoading(true)
    try {
      const recent = await recordDB.getRecentRecords(7)
      setRecords(recent)
      const today = getToday()
      setTodayRecords(recent.filter(r => r.date === today))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  const recordMeal = useCallback(async (
    dishId: number,
    dishName: string,
    mealTime: MealTime,
  ) => {
    const today = getToday()
    // 检查今天这个时段是否已经记录过
    const existing = todayRecords.find(r => r.mealTime === mealTime)
    if (existing && existing.id != null) {
      // 替换已有的
      await recordDB.deleteMealRecord(existing.id)
    }
    await recordDB.addMealRecord({ dishId, dishName, mealTime, date: today })
    await loadRecords()
  }, [todayRecords, loadRecords])

  const removeRecord = useCallback(async (id: number) => {
    await recordDB.deleteMealRecord(id)
    await loadRecords()
  }, [loadRecords])

  // 获取近7天吃过的菜品ID集合
  const recentDishIds = new Set(
    records.map(r => r.dishId)
  )

  // 获取今日已选时段
  const todayMealTimes = todayRecords.map(r => r.mealTime)

  return {
    records,
    todayRecords,
    todayMealTimes,
    recentDishIds,
    loading,
    loadRecords,
    recordMeal,
    removeRecord,
  }
}
