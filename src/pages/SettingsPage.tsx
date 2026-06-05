import { useState, useCallback, useEffect } from 'react'
import TopBar from '../components/layout/TopBar'
import PageContainer from '../components/layout/PageContainer'
import Blacklist from '../components/settings/Blacklist'
import MealHistory from '../components/meal/MealHistory'
import { useMealHistory } from '../hooks/useMealHistory'
import type { Dish } from '../types'
import { getAllDishes } from '../db/dishes'
import { db } from '../db/index'
import { Ban, Clock, Download, Trash2, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const { records, removeRecord } = useMealHistory()
  const [showBlacklist, setShowBlacklist] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // 数据导出
  const handleExport = useCallback(async () => {
    try {
      const dishes = await getAllDishes()
      const exportData = dishes.map(d => ({
        ...d,
        imageDataUrl: undefined,  // 图片不导出
        image: undefined,
      }))
      const json = JSON.stringify(exportData, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `meal-decider-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('导出失败')
    }
  }, [])

  // 清除所有数据
  const handleClearAll = useCallback(() => {
    if (confirm('确定要清除所有数据吗？包括所有菜品、用餐记录和黑名单。此操作不可恢复！')) {
      if (confirm('再次确认：真的要删除所有数据吗？')) {
        Promise.all([
          db.dishes.clear(),
          db.mealRecords.clear(),
          db.blacklist.clear(),
        ]).then(() => {
          alert('所有数据已清除')
          window.location.reload()
        })
      }
    }
  }, [])

  return (
    <>
      <TopBar title="我的" showActions={false} />
      <PageContainer>
        {/* 功能入口 */}
        <div className="bg-white rounded-xl border border-[#E8E8E0] overflow-hidden mb-4">
          <button
            onClick={() => setShowBlacklist(true)}
            className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 border-b border-[#F0F0EB]"
          >
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-[#E0746A]">
              <Ban size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#333]">忌口黑名单</p>
              <p className="text-xs text-[#999]">管理忌口食材和菜品</p>
            </div>
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <Clock size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#333]">近7天用餐记录</p>
              <p className="text-xs text-[#999]">查看近期饮食，避免重复</p>
            </div>
          </button>
        </div>

        {/* 数据管理 */}
        <div className="bg-white rounded-xl border border-[#E8E8E0] overflow-hidden mb-4">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 border-b border-[#F0F0EB]"
          >
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-[#7DB892]">
              <Download size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#333]">导出数据</p>
              <p className="text-xs text-[#999]">备份菜品数据为 JSON 文件</p>
            </div>
          </button>

          <button
            onClick={handleClearAll}
            className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50"
          >
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-[#E0746A]">
              <Trash2 size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#E0746A]">清除所有数据</p>
              <p className="text-xs text-[#999]">不可恢复，请先导出备份</p>
            </div>
          </button>
        </div>

        {/* 使用说明 */}
        <div className="bg-white rounded-xl border border-[#E8E8E0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-[#7DB892]" />
            <span className="text-sm font-medium text-[#666]">使用提示</span>
          </div>
          <ul className="text-xs text-[#999] space-y-1.5 leading-relaxed">
            <li>• 首页顶部点「随机」可一键生成今日三餐搭配</li>
            <li>• 搜索支持菜品名、食材关键词搜索</li>
            <li>• 点「吃了这个」记录用餐，7天内不会重复推荐</li>
            <li>• 临时备选菜到期会自动清理</li>
            <li>• 收藏常备菜品永久保存</li>
            <li>• 外卖专属页支持拍照导入菜单</li>
            <li>• 设置黑名单后，筛选和配餐自动屏蔽</li>
          </ul>
        </div>
      </PageContainer>

      {showBlacklist && <Blacklist onClose={() => setShowBlacklist(false)} />}

      {/* 用餐记录弹窗 */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={() => setShowHistory(false)}>
          <div className="bg-white rounded-t-2xl w-full max-w-lg px-5 pt-5 pb-8 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#333] text-lg">近7天用餐记录</h3>
              <button onClick={() => setShowHistory(false)} className="text-[#999]">
                <span className="text-sm">关闭</span>
              </button>
            </div>
            <MealHistory records={records} onRemove={removeRecord} />
          </div>
        </div>
      )}
    </>
  )
}
