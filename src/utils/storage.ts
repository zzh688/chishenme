// 图片处理工具

// 将 File/Blob 转为 data URL
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// 将 data URL 转为 Blob
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',')
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png'
  const binary = atob(parts[1])
  const array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i)
  }
  return new Blob([array], { type: mime })
}

// 压缩图片（限制最大宽度/高度）
export function compressImage(file: File, maxSize: number = 800): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width <= maxSize && height <= maxSize) {
        resolve(file)
        return
      }
      const ratio = Math.min(maxSize / width, maxSize / height)
      width = Math.round(width * ratio)
      height = Math.round(height * ratio)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        if (blob) resolve(blob)
        else reject(new Error('压缩失败'))
      }, 'image/jpeg', 0.8)
    }
    img.onerror = reject
    img.src = url
  })
}

// 格式化价格
export function formatPrice(price: number): string {
  return `¥${price.toFixed(0)}`
}

// 时段中文映射
export const mealTimeLabels: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
}

// 难度中文映射
export const difficultyLabels: Record<string, string> = {
  lazy: '懒人速做',
  cook: '下厨正餐',
  takeout: '外卖',
}

// 难度颜色映射
export const difficultyColors: Record<string, string> = {
  lazy: 'bg-green-100 text-green-700',
  cook: 'bg-orange-100 text-orange-700',
  takeout: 'bg-blue-100 text-blue-700',
}

// 获取今日日期字符串
export function getToday(): string {
  return new Date().toISOString().split('T')[0]
}
