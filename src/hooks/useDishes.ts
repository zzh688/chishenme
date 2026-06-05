import { useState, useEffect, useCallback } from 'react'
import type { Dish, Category } from '../types'
import * as dishDB from '../db/dishes'
import { blobToDataUrl } from '../utils/storage'

export function useDishes(category?: Category) {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)

  const loadDishes = useCallback(async () => {
    setLoading(true)
    try {
      let result: Dish[]
      if (category) {
        result = await dishDB.getDishesByCategory(category)
      } else {
        result = await dishDB.getAllDishes()
      }
      // 按置顶+时间排序
      result.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
        if (a.isPinned && b.isPinned) return (b.sortOrder || 0) - (a.sortOrder || 0)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      setDishes(result)
    } catch (err) {
      console.error('加载菜品失败:', err)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    loadDishes()
  }, [loadDishes])

  const addDish = useCallback(async (dish: Omit<Dish, 'id' | 'createdAt' | 'sortOrder'>, imageFile?: File) => {
    let imageDataUrl: string | null = null
    if (imageFile) {
      imageDataUrl = await blobToDataUrl(imageFile)
    }
    await dishDB.addDish({ ...dish, imageDataUrl })
    await loadDishes()
  }, [loadDishes])

  const updateDish = useCallback(async (id: number, changes: Partial<Dish>, imageFile?: File) => {
    if (imageFile) {
      const imageDataUrl = await blobToDataUrl(imageFile)
      changes.imageDataUrl = imageDataUrl
    }
    await dishDB.updateDish(id, changes)
    await loadDishes()
  }, [loadDishes])

  const removeDish = useCallback(async (id: number) => {
    await dishDB.deleteDish(id)
    await loadDishes()
  }, [loadDishes])

  const togglePin = useCallback(async (id: number, pinned: boolean) => {
    await dishDB.togglePin(id, pinned)
    await loadDishes()
  }, [loadDishes])

  const moveDish = useCallback(async (id: number, direction: 'up' | 'down') => {
    const idx = dishes.findIndex(d => d.id === id)
    if (idx === -1) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= dishes.length) return

    // 只允许在同类（都是置顶或都不是置顶）之间移动
    if (dishes[idx].isPinned !== dishes[swapIdx].isPinned) return

    const current = dishes[idx]
    const swap = dishes[swapIdx]
    if (current.id == null || swap.id == null) return

    await dishDB.updateSortOrder(current.id, swap.sortOrder || 0)
    await dishDB.updateSortOrder(swap.id, current.sortOrder || 0)
    await loadDishes()
  }, [dishes, loadDishes])

  return { dishes, loading, loadDishes, addDish, updateDish, removeDish, togglePin, moveDish }
}
