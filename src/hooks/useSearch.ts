import { useState, useCallback, useMemo } from 'react'
import type { Dish, FilterOptions, MealTime } from '../types'

export function useSearch(allDishes: Dish[]) {
  const [filters, setFilters] = useState<FilterOptions>({ tags: [] })

  const updateFilter = useCallback((key: keyof FilterOptions, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleTag = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({ tags: [] })
  }, [])

  const results = useMemo(() => {
    let filtered = [...allDishes]

    // 关键词搜索
    if (filters.keyword) {
      const k = filters.keyword.toLowerCase()
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(k) ||
        d.ingredients.some(i => i.toLowerCase().includes(k))
      )
    }

    // 菜系筛选
    if (filters.cuisine && filters.cuisine !== '全部') {
      filtered = filtered.filter(d => d.cuisine === filters.cuisine)
    }

    // 用餐时段
    if (filters.mealTime && filters.mealTime !== '全部') {
      const mt = filters.mealTime as MealTime
      filtered = filtered.filter(d => d.mealTime.includes(mt))
    }

    // 价格区间
    if (filters.priceMin != null) {
      filtered = filtered.filter(d => d.price >= filters.priceMin!)
    }
    if (filters.priceMax != null) {
      filtered = filtered.filter(d => d.price <= filters.priceMax!)
    }

    // 制作难度
    if (filters.difficulty && filters.difficulty !== '全部') {
      filtered = filtered.filter(d => d.difficulty === filters.difficulty)
    }

    // 标签（交集：必须包含所有选中标签）
    if (filters.tags.length > 0) {
      filtered = filtered.filter(d =>
        filters.tags.every(t => d.tags.includes(t))
      )
    }

    // 分区
    if (filters.category && filters.category !== '全部') {
      filtered = filtered.filter(d => d.category === filters.category)
    }

    return filtered
  }, [allDishes, filters])

  return { filters, results, updateFilter, toggleTag, clearFilters }
}
