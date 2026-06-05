import Dexie, { type Table } from 'dexie'
import type { Dish, MealRecord, BlacklistItem } from '../types'

class MealDeciderDB extends Dexie {
  dishes!: Table<Dish, number>
  mealRecords!: Table<MealRecord, number>
  blacklist!: Table<BlacklistItem, number>

  constructor() {
    super('MealDeciderDB')

    this.version(1).stores({
      dishes: '++id, name, cuisine, price, difficulty, category, isPinned, sortOrder, createdAt, *ingredients, *tags, *mealTime, expireDays',
      mealRecords: '++id, dishId, mealTime, date',
      blacklist: '++id, keyword, type',
    })
  }
}

export const db = new MealDeciderDB()
