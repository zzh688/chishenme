import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import type { BlacklistItem } from '../../types'
import * as blacklistDB from '../../db/blacklist'

interface BlacklistProps {
  onClose: () => void
}

export default function Blacklist({ onClose }: BlacklistProps) {
  const [items, setItems] = useState<BlacklistItem[]>([])
  const [keyword, setKeyword] = useState('')
  const [type, setType] = useState<'ingredient' | 'dish'>('ingredient')

  const load = async () => {
    setItems(await blacklistDB.getBlacklist())
  }

  useEffect(() => {
    load()
  }, [])

  const addItem = async () => {
    const kw = keyword.trim()
    if (!kw) return
    // 检查重复
    if (items.some(i => i.keyword === kw)) {
      setKeyword('')
      return
    }
    await blacklistDB.addBlacklistItem({ keyword: kw, type })
    setKeyword('')
    await load()
  }

  const removeItem = async (id: number) => {
    await blacklistDB.removeBlacklistItem(id)
    await load()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-2xl w-full max-w-lg px-5 pt-5 pb-8 max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="font-semibold text-[#333] text-lg">忌口黑名单</h3>
          <button onClick={onClose} className="text-[#999]"><X size={22} /></button>
        </div>

        <p className="text-sm text-[#999] mb-3 shrink-0">
          添加忌口食材或菜品名称，筛选和配餐时将自动屏蔽
        </p>

        {/* 添加 */}
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <select
            value={type}
            onChange={e => setType(e.target.value as 'ingredient' | 'dish')}
            className="text-sm px-3 py-2.5 rounded-lg border border-[#E8E8E0] bg-white outline-none"
          >
            <option value="ingredient">食材</option>
            <option value="dish">菜名</option>
          </select>
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder={type === 'ingredient' ? '如：香菜、羊肉' : '如：麻辣烫'}
            className="flex-1 px-3 py-2.5 rounded-lg border border-[#E8E8E0] text-sm outline-none focus:border-[#7DB892]"
          />
          <button
            onClick={addItem}
            disabled={!keyword.trim()}
            className="shrink-0 w-9 h-9 rounded-lg bg-[#7DB892] text-white flex items-center justify-center disabled:opacity-50"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* 列表 */}
        <div className="flex-1 overflow-y-auto space-y-1.5">
          {items.length === 0 && (
            <p className="text-sm text-[#ccc] text-center py-8">暂无忌口项</p>
          )}
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#FAFAF5]">
              <div className="flex items-center gap-2">
                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-[#888]">
                  {item.type === 'ingredient' ? '食材' : '菜名'}
                </span>
                <span className="text-sm text-[#333]">{item.keyword}</span>
              </div>
              <button onClick={() => item.id != null && removeItem(item.id)}
                className="text-[#ddd] hover:text-[#E0746A] transition-colors">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
