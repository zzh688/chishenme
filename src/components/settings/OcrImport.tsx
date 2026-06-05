import { useState, useRef } from 'react'
import { X, Camera, ImageUp, Loader2, Check, Plus } from 'lucide-react'
import { recognizeMenu } from '../../utils/ocr'

interface OcrImportProps {
  onImport: (items: Array<{ name: string; price: number }>) => void
  onClose: () => void
}

export default function OcrImport({ onImport, onClose }: OcrImportProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [items, setItems] = useState<Array<{ name: string; price: number; selected: boolean }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleImage = async (file: File) => {
    setPreview(URL.createObjectURL(file))
    setLoading(true)
    setError('')
    try {
      const results = await recognizeMenu(file)
      if (results.length === 0) {
        setError('未能识别到菜品，请尝试更清晰的图片或手动录入')
      }
      setItems(results.map(r => ({ ...r, selected: true })))
    } catch {
      setError('识别失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImage(file)
  }

  const toggleItem = (i: number) => {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, selected: !item.selected } : item))
  }

  const handleImport = () => {
    const selected = items.filter(i => i.selected).map(({ name, price }) => ({ name, price }))
    if (selected.length > 0) {
      onImport(selected)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E8E0] shrink-0">
        <button onClick={onClose} className="text-[#999]"><X size={24} /></button>
        <h2 className="font-semibold text-[#333]">拍照导入菜单</h2>
        <button
          onClick={handleImport}
          disabled={!items.some(i => i.selected)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            items.some(i => i.selected) ? 'bg-[#7DB892] text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          导入 ({items.filter(i => i.selected).length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 拍照/选图按钮 */}
        {!preview && (
          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-12 rounded-xl border-2 border-dashed border-[#ddd] flex flex-col items-center justify-center gap-2 text-[#999] hover:border-[#7DB892] hover:text-[#7DB892] transition-colors"
            >
              <ImageUp size={32} />
              <span>从相册选择</span>
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 py-12 rounded-xl border-2 border-dashed border-[#ddd] flex flex-col items-center justify-center gap-2 text-[#999] hover:border-[#7DB892] hover:text-[#7DB892] transition-colors"
            >
              <Camera size={32} />
              <span>拍照识别</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
          </div>
        )}

        {/* 预览 */}
        {preview && (
          <div className="relative rounded-xl overflow-hidden bg-gray-100">
            <img src={preview} alt="菜单预览" className="w-full max-h-48 object-contain" />
            <button
              onClick={() => { setPreview(null); setItems([]); setError('') }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* 加载 */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 text-[#7DB892]">
            <Loader2 size={28} className="animate-spin mb-2" />
            <span className="text-sm">正在识别菜单文字...</span>
          </div>
        )}

        {/* 错误 */}
        {error && (
          <p className="text-sm text-[#E0746A] text-center py-4">{error}</p>
        )}

        {/* 识别结果 */}
        {items.length > 0 && !loading && (
          <div>
            <p className="text-sm text-[#999] mb-2">识别到 {items.length} 个菜品，点击勾选要导入的：</p>
            <div className="space-y-1.5">
              {items.map((item, i) => (
                <div
                  key={i}
                  onClick={() => toggleItem(i)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                    item.selected
                      ? 'border-[#7DB892] bg-[#E8F5EC]'
                      : 'border-[#E8E8E0] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      item.selected ? 'border-[#7DB892] bg-[#7DB892]' : 'border-[#ddd]'
                    }`}>
                      {item.selected && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-sm text-[#333]">{item.name}</span>
                  </div>
                  {item.price > 0 && (
                    <span className="text-sm text-[#7DB892] font-medium">¥{item.price}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
